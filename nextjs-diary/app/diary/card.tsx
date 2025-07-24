'use client'
import './card.css'

import { useState } from "react"
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Card() {
    const [ status, setStatus ] = useState("Active");    
    const { data, error, isLoading } = useSWR("/api/diary/", fetcher, {refreshInterval: 1000})
    console.log("dd",data);
    
    if (error) return "An error happening"
    if (isLoading) return "Loading..."

    
    const handleStatus = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (status === "Active") {
            setStatus("Done")            
        } else {
            setStatus("Active")
        }

    }

    
    
    return (
        <div className="event">
            <h3 className="date">01/01/2026</h3>
            <div className="event_container">
                <div className="main_event">
                    <div className="event_detail">
                        <div className="hour_case">
                            <p className="hour">00:00</p>
                        </div>
                        <div className="category_case">
                            <p className="category">Category</p>
                        </div>
                        <div className="topic_case">
                            <p className="topic">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                        <div className="state_case">
                            <button 
                            onClick={handleStatus} 
                            className="state"
                            style={{background: `${status==="Active" ? "#427ffa" : "limegreen"}`}}>{status}</button>
                        </div>
                    </div>
                </div>
                <button className="delete">Delete</button>
            </div>
        </div>
    )
}