import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export async function timeNow() {
    const [dbResponse] = await sql`SELECT NOW()`
    const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ""
    return {dbNow: dbNow}
}

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

export async function getEventByTopic(query, currentPage = 1) {
    return await sql`
        SELECT * FROM events AS event
        WHERE event.topic ILIKE 'Buy a milk'
    `
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