'use client'
import './card.css'

import { useState } from "react"
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Card() {
    const [ status, setStatus ] = useState<{[key: number]: string}>({});    
    const { data, error, isLoading } = useSWR("/api/diary/", fetcher, {refreshInterval: 1000})
    
    type Event = {
        id: number;
        topic: string;
        category: string;
        date: string;
        hour: string;
    };
    
    if (error) return "An error happening"
    if (isLoading) return "Loading..."

    
    const handlesStatus = async (id: number) => {
        setStatus(prev => ({
            ...prev,
            [id]: prev[id] === "Done" ? "Active" : "Done"
        }));

        await fetch(`/api/diary/${id}`, { 
            method: 'UPDATE', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id })
        });
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/diary/${id}`, { 
            method: 'DELETE', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id })
        });
    };

    if (!Array.isArray(data) || data.length === 0) {
        return <div className="no_events">No events planned</div>;
    }

    return (
        <>
        {data.map((event: Event, index: number) => {
            const currentStatus = status[event.id] || "Active";
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
                            onClick={(e) => handlesStatus(event.id)}
                            className="state"
                            style={{background: currentStatus === "Active" ? "#427ffa" : "limegreen"}}>{currentStatus}</button>
                        </div>
                    </div>
                </div>
                <button className="delete" onClick={() => handleDelete(event.id)}><img src="/delete-bin-7-line.svg" alt="delete"/></button>
            </div>
        </div>
        })}
        </>
    )
}