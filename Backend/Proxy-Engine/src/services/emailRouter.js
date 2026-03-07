import User from '../../../src/models/user.js';
import ShieldIdentity from '../../../src/models/ShieldIdentity.js';
import { sendEmail } from './emailSender.js';

export const routeEmailToUser = async (emailData) => {
  const { to: proxyEmail } = emailData;

  const shieldIdentity = await ShieldIdentity.findOne({ 
    proxy_email: proxyEmail,
    status: 'active'
  });

  if (!shieldIdentity) {
    return {
      success: false,
      reason: 'no_active_shield_identity',
      message: 'No active shield identity found for this proxy email'
    };
  }

  const user = await User.findById(shieldIdentity.user_id);

  if (!user) {
    return {
      success: false,
      reason: 'user_not_found',
      message: 'User not found for this shield identity'
    };
  }

  if (user.status !== 'active') {
    return {
      success: false,
      reason: 'user_inactive',
      message: 'User account is not active'
    };
  }

  const realEmail = user.real_email;

  const forwardedEmail = {
    from: emailData.from,
    to: realEmail,
    subject: `[Proxy] ${emailData.subject}`,
    text: emailData.text,
    html: emailData.html,
    attachments: emailData.attachments,
    headers: {
      ...emailData.headers,
      'X-Original-To': proxyEmail,
      'X-Forwarded-To': realEmail,
      'X-Proxy-Identity': shieldIdentity._id.toString(),
    }
  };

  try {
    const result = await sendEmail(forwardedEmail);
    
    return {
      success: true,
      realEmail,
      userId: user._id,
      shieldIdentityId: shieldIdentity._id,
      messageId: result.messageId,
      message: 'Email forwarded to user successfully'
    };
  } catch (error) {
    return {
      success: false,
      reason: 'forward_failed',
      message: `Failed to forward email: ${error.message}`
    };
  }
};

export const lookupProxyEmail = async (proxyEmail) => {
  const shieldIdentity = await ShieldIdentity.findOne({ 
    proxy_email: proxyEmail,
    status: 'active'
  }).populate('user_id', 'real_email status');

  if (!shieldIdentity) {
    return null;
  }

  return {
    proxyEmail: shieldIdentity.proxy_email,
    realEmail: shieldIdentity.user_id?.real_email,
    userId: shieldIdentity.user_id?._id,
    userStatus: shieldIdentity.user_id?.status,
    shieldIdentityId: shieldIdentity._id,
    status: shieldIdentity.status
  };
};

export const getAllProxyEmailsForUser = async (userId) => {
  const identities = await ShieldIdentity.find({ 
    user_id: userId,
    status: 'active'
  });

  return identities.map(id => ({
    proxyEmail: id.proxy_email,
    status: id.status,
    createdAt: id.creation_time,
    lastUsed: id.last_used
  }));
};
