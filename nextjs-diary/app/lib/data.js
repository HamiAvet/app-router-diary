import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function timeNow() {
    const [dbResponse] = await sql`SELECT NOW()`
    console.log(dbResponse);
    
    const dbNow = dbResponse && dbResponse.now ? dbResponse.now : ""
    return dbNow
}