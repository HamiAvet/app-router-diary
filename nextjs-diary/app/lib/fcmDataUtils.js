import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);


export async function addFcmToken(userId, fcmToken) {
    try {
        /*
        // Create fcmtokens table if it doesn't exist
        await sql`
            CREATE TABLE IF NOT EXISTS fcmtokens (
                fcmtokenid SERIAL PRIMARY KEY NOT NULL,
                userid VARCHAR(100) UNIQUE NOT NULL,
                fcmtoken VARCHAR(255) UNIQUE NOT NULL,
                createdat TIMESTAMP NOT NULL DEFAULT NOW(),
                lastused TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `;
        */
        // Insert the new FCM token into the database
        await sql`
                INSERT INTO fcmtokens (userid, fcmtoken)
                VALUES (${userId}, ${fcmToken})
                ON CONFLICT (userid)
                DO UPDATE SET
                fcmtoken = EXCLUDED.fcmtoken,
                lastused = NOW()
        `;
    } catch (error) {
        console.error('Error saving FCM token:', error);
        return error;
    }   
}

export async function getFcmTokenByUserId(userId) {
    try {
        // Retrieve the FCM token for the specified user ID from the database
        const rows = await sql`
            SELECT fcmtoken
            FROM fcmtokens
            WHERE userid = ${userId}
            LIMIT 1
        `;

        return rows[0]?.fcmtoken ?? null;
    } catch (error) {
        console.error('Error retrieving FCM tokens:', error);
        return error;
    }
}

export async function updateFcmTokenByUserId(userId, fcmToken) {
    const rows = await sql`
        UPDATE fcmtokens
        SET fcmtoken = ${fcmToken}, lastused = NOW()
        WHERE userid = ${userId}
        RETURNING fcmtoken
    `;

    return rows?.[0]?.fcmtoken ?? null;
}

export async function deleteFcmToken(userId, fcmToken) {
    try {
        // Delete the specified FCM token from the database
        await sql`
            DELETE FROM fcmtokens 
            WHERE userid = ${userId} AND fcmtoken = ${fcmToken}
        `;
    } catch (error) {
        console.error('Error deleting FCM token:', error);
        return error;
    }
}


export async function deleteOldFcmTokens() {
    await sql`
        DELETE FROM fcmtokens
        WHERE lastused < (NOW() - INTERVAL '3 months')
    `;

    return "FCM tokens are deleted"
}