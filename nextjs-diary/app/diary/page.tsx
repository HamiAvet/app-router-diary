import Card from "@/app/ui/card/card"
import Search from "@/app/ui/search/search"
import NavBar from "@/app/ui/navbar/navbar"
import Link from "next/link"
import Image from "next/image"
import "./page.css"

type tParams = Promise<{ query?: string, page?: string }>;

export default async function Diary(props: { searchParams?: tParams }) {
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