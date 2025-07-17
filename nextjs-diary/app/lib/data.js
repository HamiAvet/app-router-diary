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
        )`;

    const inserted = await sql`
        INSERT INTO links (url)
        VALUES (${url})
        RETURNING id, url, create_at;
    `;

    return inserted; 
}


export async function getLink() {
    return await sql`SELECT * FROM links`;
}


//configureDatabase().catch(err=>console.log("db config err", err))