import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export async function addFcmToken(userId, token) {
    try {
        // Create fcm_tokens table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS fcm_tokens (
                id SERIAL PRIMARY KEY NOT NULL,
                userId VARCHAR(100),
                fcmToken VARCHAR(255),
                createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
                lastUsed TIMESTAMP NOT NULL DEFAULT NOW(),
                valid BOOLEAN NOT NULL DEFAULT FALSE
            );
        `;
        // Insert the new FCM token into the database
        await sql`
            INSERT INTO fcm_tokens (userId, fcmToken, valid)
            VALUES (${userId}, ${token}, TRUE)
        `;
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return error;
    }   
}

export async function getFcmTokensByUserId(userId) {
    try {
        // Retrieve all FCM tokens for the specified user ID
        return await sql`
            SELECT fcmToken FROM fcm_tokens 
            WHERE userId = ${userId}
        `;
    } catch (error) {
        console.error('Error retrieving FCM tokens:', error);
        return error;
    }
}

export async function deleteFcmToken(token) {
    try {
        // Delete the specified FCM token from the database
        await sql`
            DELETE FROM fcm_tokens WHERE fcmToken = ${token}
        `;
    } catch (error) {
        console.error('Error deleting FCM token:', error);
        return error;
    }
}
