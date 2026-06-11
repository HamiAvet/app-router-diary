"use client" 

import Card from "@/app/ui/card/card"
import Search from "@/app/ui/search/search"
import NavBar from "@/app/ui/navbar/navbar"
import Footer from "@/app/ui/footer/footer"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import "@/app/diary/page.css"
              
function DiaryContent() { 
  const searchParams = useSearchParams() ; // get search params
  const currentPage = Number(searchParams?.get("page")) || 1; // get current page from search params, default to 1

  // Return the diary page JSX
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
              Add an event
            </button>
          </Link>
        </div>
        <div className="events_list">
            <Card currentPage={currentPage}/>
        </div>
      </div>
      <Footer />
    </>
        
  );
}

// The function useSearchParams() should be wrapped in a suspense boundary, so we create a parent component to handle that
export default function Diary() {
  return (
    // Wrap DiaryContent in Suspense to handle async search params with a fallback UI loading state
    <Suspense fallback={<div>Loading...</div>}>
      <DiaryContent />
    </Suspense>
  );
}