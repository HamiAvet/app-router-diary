import { pbkdf2Sync } from "crypto"

const saltKey = process.env.SALT_KEY ? process.env.SALT_KEY : '3ed3ffd97c14fe72ddc2d2d3651881c6'
const hashIterations = 100000
const keylen = 64
const digest = 'sha512'

export function hashPassword(rawPasswordString) {
    const key = pbkdf2Sync(rawPasswordString, saltKey, hashIterations, keylen, digest);
    return key.toString('hex');
}

export function verifyPassword(enteredRawPassword, storeHash) {
    const hash = pbkdf2Sync(enteredRawPassword, saltKey, hashIterations, keylen, digest).toString('hex');
    
    return storeHash === hash;
}
