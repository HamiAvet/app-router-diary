import * as jose from 'jose';
import { cookies } from 'next/headers';

// Secret key for JWT encryption/decryption
const secret = new TextEncoder().encode(process.env.JOSE_SECRET_KEY);

// JWT configuration
const issuer = 'urn:example:issuer'; // Issuer identifier
const audience = 'urn:example:audience'; // Audience identifier
const expirationTime = '10s'; // Token expiration time

// Session management functions

export default async function encodeUserSession(userId) {
    // Encode user session into a JWT function
    try {
        // Encode user session into a JWT
        const jwt = await new jose.EncryptJWT({ 'userId': userId })
            .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
            .setIssuedAt()
            .setIssuer(issuer)
            .setAudience(audience)
            .setExpirationTime(expirationTime)
            .encrypt(secret)

        // Return the generated JWT
        return jwt;
    } catch (error) {
        return error;
    }
}

export async function decodeUserSession(jwt) {
    // Decode user session from a JWT function
    try {
        // Decode user session from the JWT
        const { payload } = await jose.jwtDecrypt(jwt, secret, {
            issuer: issuer, // Verify issuer
            audience: audience, // Verify audience
        })

        // Return the decoded payload
        return payload;
    } catch (error) {
        return error;
    }
}

export const setSessionUser = async (userId) => {
    // Set the session user by storing the JWT in cookies function
    try {
        // Generate new session JWT
        const newSessionVale = await encodeUserSession(userId);
        // Get the cookie store
        const cookieStore = await cookies(); 
        // Set the sessionId cookie
        cookieStore.set('sessionId', newSessionVale);
    } catch (error) {
        return error;
    }
}

export const verifySessionUser = async () => {
    // Get the session user by retrieving and decoding the JWT from cookies function
    try {
        // Get the cookie store
        const cookieStore = await cookies();
        // Get the sessionId cookie value
        const sessionId = cookieStore.get('sessionId')?.value;
        
        // If sessionId cookie does not exist, return false
        if (!sessionId) {
            return false;
        }
        
        // If sessionId exists, return true
        return true;
    } catch (error) {
        return error;
    }
}

export const endSessionUser = async () => {
    // End the session user by deleting the JWT cookie function
    try {
        // Get the cookie store
        const cookieStore = await cookies();
        // Delete the sessionId cookie
        cookieStore.delete('sessionId');
    } catch (error) {
        return error;
    }
}