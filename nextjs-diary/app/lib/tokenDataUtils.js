import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export async function addNewToken(tokenData) {
    // Add a new token to the database function
    try {
        // Create tokens table if not exists
        await sql`
            CREATE TABLE IF NOT EXISTS tokens (
                id SERIAL PRIMARY KEY,
                token VARCHAR(100) NOT NULL,
                userId VARCHAR(100) NOT NULL,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expiresAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 hour',
                used BOOLEAN DEFAULT FALSE
            );
        `;
        // Insert new token
        const inserted = await sql`
            INSERT INTO tokens (token, userId)
            VALUES (${tokenData.token}, ${tokenData.userId})
            RETURNING token, userId, createdAt, expiresAt, used;
        `;
        return inserted;
    } catch (error) {
        return error;
    }
}

export async function getTokenData(token) {
    // Get token data from the database function
    try {
        // Get token data by token
        const tokenData = await sql`
            SELECT token, userId, createdAt
            FROM tokens
            WHERE token = ${token}
        `;
        /*if (tokenData.length === 0) {
            return ["No token found"];
        }*/
        console.log("Token data retrieved:", tokenData);
        
        return tokenData;
    }
    catch (error) {
        return error;
    }
}

export async function deleteToken(token) {
    // Delete a token from the database function
    try {
        // Delete token by token
        await sql`
            DELETE FROM tokens
            WHERE token = ${token}
        `;
        return { message: 'Token deleted successfully' };
    } catch (error) {
        return error;
    }
}