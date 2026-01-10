import postgres from 'postgres';
import { hashPassword } from './passwordUtils';

const sql = postgres(process.env.POSTGRES_URL);

// Diary event functions
export async function addEvent(event) {
    try {
         /*await sql`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY NOT NULL,
                topic VARCHAR(255),
                category VARCHAR(255),
                date VARCHAR(50),
                hour VARCHAR(10),
                status VARCHAR(10)
            );
        `*/
        const inserted = await sql`
            INSERT INTO events (topic, category, date, hour, status)
            VALUES (${event.topic}, ${event.category}, ${event.date}, ${event.hour ? event.hour : null}, ${"Active"})
            RETURNING id, topic, category, date, hour, status;
        `

        return inserted
    } catch (error) {
        console.log("Error adding event:", error);
        return error
    }
}

export async function getAllEvents() {
    try {
        return await sql`
            SELECT * FROM events 
            ORDER BY date, hour
            
        `;        
    } catch (error) {
        console.log("Error retrieving events:", error);
        return error;
    }
}

export async function getEvent(event) {
    try {
        console.log(event.topic, event.category, event.date, event.hour);
        if (event.hour === "") {
            return await sql`
                SELECT * FROM events 
                WHERE topic = ${event.topic} AND category = ${event.category} AND date = ${event.date} AND hour IS NULL
                ORDER BY date, hour
            `;      
        } else {
            return await sql`
                SELECT * FROM events 
                WHERE topic = ${event.topic} AND category = ${event.category} AND date = ${event.date} AND hour = ${event.hour}
                ORDER BY date, hour
            `;        
        }
    } catch (error) {
        console.log("Error retrieving events:", error);
        return error;
    }
}

export async function deleteEvent(event) {
    try {
        return await sql`
            DELETE FROM events 
            WHERE id = ${event.id}
        `;
    } catch (error) {
        console.log("Error deleting event:", error);
        return error
        
    }
}

export async function updateEventStatus(event) {
    try {
        await sql`
            UPDATE events
            SET status = ${event.status}
            WHERE id = ${event.id}
        `        
    } catch (error) {
        console.log("Error updating event status:", error);
        return error
    }
}

// User functions
export async function addUser(user) {
    try {
        /*await sql`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) PRIMARY KEY NOT NULL,
                username VARCHAR(50) UNIQUE,
                email VARCHAR(100) UNIQUE,
                password VARCHAR(255)
            );
        `*/
        const inserted = await sql`
            INSERT INTO users (id, username, email, password)
            VALUES (${user.id}, ${user.username}, ${user.email}, ${hashPassword(user.password)})
            RETURNING id, username, email, password;
        `

        return inserted
                
    } catch (error) {
        return error
    }
}

export async function getUserByEmail(user) {    
    try {
        return await sql`
            SELECT id, username, email, password
            FROM users 
            WHERE email = ${user.email}
        `        
    } catch (error) {
        console.log("Error getting user by email:", error);
        return error
    }
}

export async function getUserById(id) {    
    try {
        return await sql`
            SELECT id, username, email, password
            FROM users 
            WHERE id = ${id}
        `        
    } catch (error) {
        console.log("Error getting user by ID:", error);
        return error
    }
}

// Change functions
export async function changeUserNameById(user) {    
    try {
        return await sql`
            UPDATE users
            SET username = ${user.newUsername}
            WHERE id = ${user.id}
        `        
    } catch (error) {
        console.log("Error changing username:", error);
        return error
    }
}

export async function changeUserEmailById(user) {    
    try {
        return await sql`
            UPDATE users
            SET email = ${user.newEmail}
            WHERE id = ${user.id}
        `        
    } catch (error) {
        console.log("Error changing email:", error);
        return error
    }
}

export async function changeUserPasswordById(user) { 
    try {
        return await sql`
            UPDATE users
            SET password = ${hashPassword(user.newPassword)}
            WHERE id = ${user.id}
        `        
    } catch (error) {
        console.log("Error changing password:", error);
        return error
    }   
}

export async function deleteUserById(id) {    
    try {
        return await sql`
            DELETE FROM users 
            WHERE id = ${id}
        `
    } catch (error) {
        console.log("Error deleting user:", error);
        return error
    }
}