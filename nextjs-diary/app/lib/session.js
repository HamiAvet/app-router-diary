import * as jose from 'jose'
import { cookies } from 'next/headers'

//const secret = jose.base64url.decode(process.env.JOSE_SECRET_KEY)
const secret = new TextEncoder().encode(process.env.JOSE_SECRET_KEY)

const issuer = 'urn:example:issuer'
const audience = 'urn:example:audience'
const expirationTime = '10s'

export default async function encodeUserSession(userId) {
    const jwt = await new jose.EncryptJWT({ 'userId': userId })
        .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
        .setIssuedAt()
        .setIssuer(issuer)
        .setAudience(audience)
        .setExpirationTime(expirationTime)
        .encrypt(secret)
    return jwt
    
}


export async function decodeUserSession(jwt) {
    try {
        const { payload } = await jose.jwtDecrypt(jwt, secret, {
            issuer: issuer,
            audience: audience,
        })

        return payload
    } catch (error) {
        
    }
    return null
}


/*async function test() {
    const userId = '1234567890'
    const jwt = await encodeUserSession(userId)
    console.log("JWT:", jwt);
    
    const payload = await decodeUserSession(jwt)        
    console.log("Payload:", payload);
    const user = payload.userId
    console.log("user: ", user, "userId: ",userId, user === userId); 
}
    
test().then(() => console.log("Test complete")).catch(console.error)*/

export const setSessionUser = async (userId) => {
    try {
        const newSessionVale = await encodeUserSession(userId)
        const cookieStore = await cookies();
        cookieStore.set('sessionId', newSessionVale, /*{ httpOnly: true, path: '/' }*/)
    } catch (error) {
        return 
    }

}

export const getSessionUser = async () => {
    try {
        const cookieStore = await cookies()
        const sessionId = cookieStore.get('sessionId').value
        if (!sessionId) {
            return null
        }
        const extractedUserId = await decodeUserSession(sessionId)
        return extractedUserId.userId
    } catch (error) {
        //console.error("Error decoding session:", error)
        return null
    }
}