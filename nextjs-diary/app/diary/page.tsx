import getDomain from "@/app/lib/getDomain"
import Card from "@/app/ui/card/card"
import Search from "@/app/ui/search/search"
import NavBar from "@/app/ui/navbar/navbar"
import { timeNow } from "@/app/lib/data"
import Link from "next/link"
import Image from "next/image"
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

export default async function Diary(props: { 
  searchParams?: {
    query?: string, page?: string 
  };
   }) {
  const data = await getData()
  const dbTime = await timeNow()
  console.log("Now is ", dbTime);
  const items = data && data.items ? [...data.items] : []
  console.log(items);
  console.log(process.env.NEXT_PUBLIC_VERCEL_URL);

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  

  return (
    <>
      <NavBar />
      <div className="diary_container">
          <h1>It is your diary</h1>
          <div className="tools">
            <Search placeholder="Search event..." />
            <Link href="/diary/create">
              <button className="add_event">
                <Image src="/add-circle-line.svg" alt="add_event_button" width={24} height={24} />
                Add a event
              </button>
            </Link>
          </div>
          <div className="events_list">
              <Card currentPage={currentPage}/>
          </div>
        </div>
    </>
        
  );
}