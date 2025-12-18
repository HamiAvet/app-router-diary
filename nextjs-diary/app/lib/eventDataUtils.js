import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL);

export async function addEvent(event) {
    // Add a new event to the database function
    try {
        // Create events table if not exists
        /*await sql`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY NOT NULL,
                topic VARCHAR(255),
                category VARCHAR(255),
                date VARCHAR(50),
                hour VARCHAR(10),
                status VARCHAR(10),
                userId VARCHAR(100)
            );
        `;*/
        // Insert new event
        const inserted = await sql`
            INSERT INTO events (topic, category, date, hour, status, userId)
            VALUES (${event.topic}, ${event.category}, ${event.date}, ${event.hour ? event.hour : null}, ${"Active"}, ${event.userId})
            RETURNING id, topic, category, date, hour, status, userId;
        `;
        // Return the inserted event
        return inserted;
    } catch (error) {
        console.log("Error adding event:", error);
        return error;
    }
}

export async function getAllEvents(id) {
    // Get all events from the database function
    try {
        // Get all events ordered by date and hour
        return await sql`
            SELECT * FROM events 
            WHERE userId = ${id}
            ORDER BY date, hour
        `;        
    } catch (error) {
        console.log("Error retrieving events:", error);
        return error;
    }
}

export async function getEvent(event) {
    // Get a specific event from the database function
    try {
        // If hour is not provided
        if (event.hour === "") { 
            // Get event without hour
            return await sql`
                SELECT * FROM events 
                WHERE topic = ${event.topic} AND category = ${event.category} AND date = ${event.date} AND hour IS NULL
                ORDER BY date, hour
            `;      
        } else {
            // Get event with hour
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
    // Delete an event from the database function
    try {
        // Delete event by ID
        return await sql`
            DELETE FROM events 
            WHERE id = ${event.id}
        `;
    } catch (error) {
        console.log("Error deleting event:", error);
        return error;
        
    }
}

export async function updateEventStatus(event) {
    // Update the status of an event function
    try {
        // Update event status by ID
        await sql`
            UPDATE events
            SET status = ${event.status}
            WHERE id = ${event.id}
        `;
    } catch (error) {
        console.log("Error updating event status:", error);
        return error;
    }
}
