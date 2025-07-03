export default function Home() {
  return (
    <div>
      <main>
        <h1>Add an event to your calendar.</h1>
        <input type="text" name="event"/>
        <label htmlFor="event">event</label>
        <input type="date" name="date"/>
        <label htmlFor="date">date</label>
      </main>
    </div>
  );
}
