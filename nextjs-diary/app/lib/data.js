import postgres from 'postgres';
import { hashPassword } from './passwordUtils';

const sql = postgres(process.env.POSTGRES_URL);

export async function addLink(url) {
    await sql`
        CREATE TABLE IF NOT EXISTS "links"(
            "id" serial PRIMARY KEY NOT NULL,
            "url" text NOT NULL,
            "create_at" timestamp DEFAULT now()
        )
    `;

    const inserted = await sql`
        INSERT INTO links (url)
        VALUES (${url})
        RETURNING id, url, create_at;
    `;

    return inserted; 
}


export async function getLink() {
    return await sql`
        SELECT * FROM links
    `;
}

// Diary event functions
export async function addEvent(event) {
    await sql`
        CREATE TABLE IF NOT EXISTS events (
            id SERIAL PRIMARY KEY NOT NULL,
            topic VARCHAR(255),
            category VARCHAR(255),
            date VARCHAR(50),
            hour VARCHAR(10),
            status VARCHAR(6)
        );
    `
    const inserted = await sql`
        INSERT INTO events (topic, category, date, hour, status)
        VALUES (${event.topic}, ${event.category}, ${event.date}, ${event.hour}, ${"Active"})
        RETURNING id, topic, category, date, hour, status;
    `

    return inserted
}

export async function getEvent() {
    return await sql`
        SELECT * FROM events 
        ORDER BY date, hour;
    `;
}

export async function deleteEvent(event) {
    return await sql`
        DELETE FROM events 
        WHERE id = ${event.id}
    `
}

export async function updateEventStatus(event) {
    await sql`
        UPDATE events
        SET status = ${event.status}
        WHERE id = ${event.id}
    `
}

// User functions
export async function addUser(user) {
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(100) PRIMARY KEY NOT NULL,
            username VARCHAR(50) UNIQUE,
            email VARCHAR(100) UNIQUE,
            password VARCHAR(255)
        );
    `
    const inserted = await sql`
        INSERT INTO users (id, username, email, password)
        VALUES (${user.id}, ${user.username}, ${user.email}, ${hashPassword(user.password)})
        RETURNING id, username, email, password;
    `

    return inserted
}


export async function getUserByEmail(user) {    
    return await sql`
        SELECT id, username, email, password
        FROM users 
        WHERE email = ${user.email}
    `
}

export async function getUserById(id) {    
    return await sql`
        SELECT id, username, email, password
        FROM users 
        WHERE id = ${id}
    `
}

// Change functions

export async function changeUserNameById(user) {    
    return await sql`
        UPDATE users
        SET username = ${user.newUsername}
        WHERE id = ${user.id}
    `
}

export async function changeUserEmailById(user) {    
    return await sql`
        UPDATE users
        SET email = ${user.newEmail}
        WHERE id = ${user.id}
    `
}


export async function changeUserPasswordById(user) {    
    return await sql`
        UPDATE users
        SET password = ${hashPassword(user.newPassword)}
        WHERE id = ${user.id}
    `
}
