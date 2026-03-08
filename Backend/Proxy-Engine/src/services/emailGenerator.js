import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAN_DIR = path.join(__dirname, '../../Plan/shieldIdentities');

if (!fs.existsSync(PLAN_DIR)) {
  fs.mkdirSync(PLAN_DIR, { recursive: true });
}

/**
 * Generate a working proxy email using subaddressing (plus-addressing).
 * 
 * Strategy: Uses the user's own email with plus-addressing
 * e.g., john@gmail.com → john+shield_amazon_abc123@gmail.com
 * 
 * This way each user gets proxy emails forwarded to their own inbox!
 * 
 */
export const generateProxyEmail = (userEmail, website = '') => {
  const uniqueId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const siteName = website ? website.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10).toLowerCase() : 'site';
  
  // If user email is provided and valid, use it for subaddressing
  if (userEmail && userEmail.includes('@')) {
    const [localPart, domain] = userEmail.split('@');
    // Supported providers: Gmail, Outlook, Yahoo, iCloud, ProtonMail, etc.
    const supportedDomains = ['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'protonmail.com', 'proton.me'];
    
    if (supportedDomains.some(d => domain.toLowerCase().includes(d.split('.')[0]))) {
      return `${localPart}+shield_${siteName}_${uniqueId}@${domain}`;
    }
    // For other domains, still try subaddressing (many support it)
    return `${localPart}+shield_${siteName}_${uniqueId}@${domain}`;
  }
  
  // Fallback: Use catch-all email if configured
  const catchAllEmail = process.env.CATCH_ALL_EMAIL;
  if (catchAllEmail && catchAllEmail.includes('@')) {
    const [localPart, domain] = catchAllEmail.split('@');
    return `${localPart}+shield_${siteName}_${uniqueId}@${domain}`;
  }
  
  // Last resort: fake domain (won't receive emails)
  console.warn('[emailGenerator] No valid user email or CATCH_ALL_EMAIL set');
  return `shield_${siteName}_${uniqueId}@shield.proxy`;
};


export const generateRandomPhone = () => {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `+1${digits}`;
};

export const generateShieldIdentity = (userEmail, oldShieldIdentity = null) => {
  const identity = {
    proxy_email: generateProxyEmail(userEmail),
    proxy_phone: generateRandomPhone(),
    generated_at: new Date().toISOString(),
    previous_identity: oldShieldIdentity
  };

  const filename = `${identity.proxy_email.split('@')[0]}_${Date.now()}.json`;
  const filepath = path.join(PLAN_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(identity, null, 2));
  
  return identity;
};

export const getStoredIdentities = () => {
  if (!fs.existsSync(PLAN_DIR)) {
    return [];
  }
  const files = fs.readdirSync(PLAN_DIR);
  return files.map(file => {
    const content = fs.readFileSync(path.join(PLAN_DIR, file), 'utf-8');
    return JSON.parse(content);
  });
};
