'use client'
import './card.css'
import { useState } from "react"

export default function Card() {
    const [ status, setStatus ] = useState("Active");
    
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
                        <div className="title_category_case">
                            <h4 className="title">Title</h4>
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