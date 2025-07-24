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

        type Event = {
            id: number;
            topic: string;
            category: string;
            date: string;
            hour: string;
        };
    
    return (
        <>
        {data && data.map((event: Event, index: number) => {
            return <div className="event" key={`event-item-${event.id}-${index}`}>
            <h3 className="date">{event.date}</h3>
            <div className="event_container">
                <div className="main_event">
                    <div className="event_detail">
                        <div className="hour_case">
                            <p className="hour">{event.hour}</p>
                        </div>
                        <div className="category_case">
                            <p className="category">{event.category}</p>
                        </div>
                        <div className="topic_case">
                            <p className="topic">{event.topic}</p>
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
        })}
        
        </>
    )
}