// maybe needed to add "use client" because is a client component 

import Card from "@/app/ui/card/card"
import Search from "@/app/ui/search/search"
import NavBar from "@/app/ui/navbar/navbar"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getSessionUser } from "../lib/session"
import "@/app/diary/page.css"

// is better to use the function use() from 'next/navigation' for this client components

type tParams = Promise<{ query?: string, page?: string }>;
              
export default async function Diary(props: { searchParams?: tParams }) { /*maybe remove async*/
  const searchParams = await props.searchParams; /*and change this into use(props.searchParams) */
  const currentPage = Number(searchParams?.page) || 1;
  const user = await getSessionUser();
  console.log(user);
  
  /*if (JSON.stringify(user) === "{}") {
    redirect('/');
  }*/

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