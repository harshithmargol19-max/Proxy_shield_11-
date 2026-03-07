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
 * Strategy options (set PROXY_EMAIL_STRATEGY in .env):
 * - "subaddress": Uses Gmail/Outlook plus-addressing (free, easy)
 * - "domain": Uses your own domain with catch-all (requires domain)
 * 
 * For subaddress: Set CATCH_ALL_EMAIL=yourreal@gmail.com
 * For domain: Set PROXY_DOMAIN=yourdomain.com
 * 
 */
export const generateProxyEmail = (userEmail) => {
  const strategy = process.env.PROXY_EMAIL_STRATEGY || 'subaddress';
  const prefix = userEmail.substring(0, 3).toLowerCase();
  const uniqueId = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  
  if (strategy === 'domain') {
    // Option: Use your own domain with catch-all routing
    const domain = process.env.PROXY_DOMAIN || 'shield.proxy';
    return `${prefix}_${uniqueId}@${domain}`;
  }
  
  // Default: Plus-addressing (works with Gmail, Outlook, etc.)
  const catchAllEmail = process.env.CATCH_ALL_EMAIL;
  if (!catchAllEmail) {
    console.warn('[emailGenerator] CATCH_ALL_EMAIL not set, using fake domain');
    return `${prefix}_${uniqueId}@shield.proxy`;
  }
  
  const [localPart, domain] = catchAllEmail.split('@');
  return `${localPart}+shield_${prefix}_${uniqueId}@${domain}`;
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
