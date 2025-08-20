import getDomain from "@/app/lib/getDomain"
import Card from "./card"
import { timeNow } from "@/app/lib/data"
import Link from "next/link"
import "./page.css"

async function getData() {
  const domain = getDomain()
  const res = await fetch(`${domain}/api/posts`, {cache: 'no-store'})
  if (!res.ok) {
    throw new Error("Falled to fetch data")
  }

  if (res.headers.get("content-type") !== "application/json") {
    return {items: []}
  }
  return res.json()
}

export default async function Diary() {
  const data = await getData()
  const dbTime = await timeNow()
  console.log("Now is ", dbTime);
  const items = data && data.items ? [...data.items] : []
  console.log(items);
  console.log(process.env.NEXT_PUBLIC_VERCEL_URL);
  

  return (
        <div className="diary_container">
          <h1>It is your diary</h1>
          <Link href="/diary/create">
            <button className="add_event"><img src="/add-circle-line.svg" alt="add_event_button" />Add a event</button>
          </Link>
          
          <div className="events_list">
              <Card/>
          </div>
        </div>
  );
}