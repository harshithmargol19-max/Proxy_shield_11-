import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLAN_DIR = path.join(__dirname, '../../Plan/shieldIdentities');

if (!fs.existsSync(PLAN_DIR)) {
  fs.mkdirSync(PLAN_DIR, { recursive: true });
}

export const generateProxyEmail = (userEmail) => {
  const prefix = userEmail.substring(0, 3).toLowerCase();
  const now = new Date();
  const datetime = now.toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
  return `${prefix}${datetime}@shield.proxy`;
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
