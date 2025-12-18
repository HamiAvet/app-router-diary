import { pbkdf2Sync } from "crypto";

// Password hashing configuration

// Get salt key from env file or use the default one
const saltKey = process.env.SALT_KEY ? process.env.SALT_KEY : '3ed3ffd97c14fe72ddc2d2d3651881c6';

// Hashing parameters
const hashIterations = 100000; // Number of iterations
const keylen = 64; // Key length in bytes
const digest = 'sha512'; // Hashing algorithm to use

// Password utility functions
export function hashPassword(rawPasswordString) {
    // Hash the raw password string using PBKDF2
    const key = pbkdf2Sync(rawPasswordString, saltKey, hashIterations, keylen, digest);
    // Return the hashed password as a hexadecimal string
    return key.toString('hex');
}

export function verifyPassword(enteredRawPassword, storeHash) {
    // Verify the entered raw password against the stored hash
    const hash = pbkdf2Sync(enteredRawPassword, saltKey, hashIterations, keylen, digest).toString('hex');
    // Return true if the hashes match, false otherwise
    return storeHash === hash;
}
