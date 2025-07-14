'use client'

export default function LinksCreateForm() {
    
    return (
        <form action="/api/links" method="POST">
            <input type="text" defaultValue="https://github.com/
            HamiAvet/app-router-diary" name="url"/>
            <label htmlFor="event">URL</label>
            <button type="submit">submit</button>
        </form>
    )
}