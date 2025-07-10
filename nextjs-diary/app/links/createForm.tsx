export default function LinksCreateForm() {
    return (
        <form>
            <h1>Add a new event</h1>
            <input type="text" name="event"/>
            <label htmlFor="event">event</label>
            <button type="submit">submit</button>
        </form>
    )
}