import crypto from 'crypto';


export default function generateKey() {
  return crypto.randomBytes(16).toString('hex');
}
