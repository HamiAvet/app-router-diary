import postgres from 'postgres';
import { hashPassword } from './passwordUtils';

const sql = postgres(process.env.POSTGRES_URL);

export async function addUser(user) {
    // Add a new user to the database function
    try {
        // Create users table if not exists
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY NOT NULL,
                username VARCHAR(50) UNIQUE,
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255)
            );
        `;

        // Insert new user
        const inserted = await sql`
            INSERT INTO users (id, username, email, password)
            VALUES (${user.id}, ${user.username}, ${user.email}, ${hashPassword(user.password)})
            RETURNING id, username, email, password;
        `;

        return inserted;
                
    } catch (error) {
        return error;
    }
}

export async function getUserByEmail(user) {    
    // Get a user by email from the database function
    try {
        // Get user by email
        return await sql`
            SELECT id, username, email, password
            FROM users 
            WHERE email = ${user.email}
        `;
    } catch (error) {
        console.log("Error getting user by email:", error);
        return error;
    }
}

export async function getUserIdByToken(token) {    
    // Get a user ID by token from the database function
    try {
        // Get user ID by token
        return await sql`
            SELECT userid
            FROM tokens 
            WHERE token = ${token}
        `;
    } catch (error) {
        console.log("Error getting user ID by token:", error);
        return error;
    }
}

export async function getUserById(id) {    
    // Get a user by ID from the database function
    try {
        // Get user by ID
        return await sql`
            SELECT id, username, email, password
            FROM users 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log("Error getting user by ID:", error);
        return error;
    }
}

export async function changeUserNameById(user) {    
    // Change a user's username by ID function
    try {
        // Update username by ID
        return await sql`
            UPDATE users
            SET username = ${user.newUsername}
            WHERE id = ${user.id}
        `;
    } catch (error) {
        console.log("Error changing username:", error);
        return error;
    }
}

export async function changeUserEmailById(user) {    
    // Change a user's email by ID function
    try {
        // Update email by ID
        return await sql`
            UPDATE users
            SET email = ${user.newEmail}
            WHERE id = ${user.id}
        `;
    } catch (error) {
        console.log("Error changing email:", error);
        return error;
    }
}

export async function changeUserPasswordById(user) { 
    // Change a user's password by ID function
    try {
        // Update password by ID
        return await sql`
            UPDATE users
            SET password = ${hashPassword(user.newPassword)}
            WHERE id = ${user.id}
        `;
    } catch (error) {
        console.log("Error changing password:", error);
        return error;
    }   
}

export async function deleteUserById(id) {    
    // Delete a user by ID function
    try {
        // Delete user by ID
        return await sql`
            DELETE FROM users 
            WHERE id = ${id}
        `;
    } catch (error) {
        console.log("Error deleting user:", error);
        return error;
    }
}