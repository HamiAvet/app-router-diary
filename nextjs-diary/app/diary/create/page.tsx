'use client'

import { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link"
import "./page.css";

import { useRouter } from "next/navigation";


export default function CreateEventForm() {
    const [results, setResults] = useState(null);
    const [error, setError] = useState("");
    const router = useRouter();
    console.log(results);
                
    const handleForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        console.log(data.topic, data.category, data.date, data.hour);


        const now = new Date();
        const currentDate = now.toISOString().slice(0, 10); 
        const currentHour = now.toTimeString().slice(0, 5); 
        const currentDateTime = new Date(`${currentDate}T${currentHour}`);

        const eventDate = String(data.date); 
        const eventHour = String(data.hour);
        const eventDateTime = new Date(`${eventDate}T${eventHour}`);

        if (eventDateTime < currentDateTime) {
            setError("The date or time has passed.");
            return;
        }
        
        

        const JSONData = JSON.stringify(data);
        console.log(JSONData);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSONData
        };

        const response = await fetch("/api/diary/", options);
        const result = await response.json();

        setResults(result);
        if (response.ok) {
            router.push("/diary");
        }
    };

    return (
        <>
            <div className="createEvent_container">
                <h1>Create a new event</h1>
                <form className="createEvent_form" onSubmit={handleForm}>
                    <div className="topic_input_div input_div">
                        <label htmlFor="topic">Topic</label>
                        <input name="topic" id="topic" type="text" className="topic_input" maxLength={60} required/>
                    </div>
                    <div className="category_input_div input_div">
                        <label>Category</label>
                        <select name="category">
                            <option value="hobbies">hobbies</option>
                            <option value="work">work</option>
                            <option value="health">health</option>
                            <option value="shopping">shopping</option>
                            <option value="sport">sport</option>
                            <option value="administrative">administrative</option>
                            <option value="household">household</option>
                            <option value="festivities">festivities</option>
                        </select>
                    </div>

                        <div className="date_input_div input_div">
                            <label htmlFor="date">Date</label>
                            <input name="date" id="date" type="date" className="date_input" required/>
                        </div>
                        <div className="hour_input_div input_div">
                            <label htmlFor="hour">Hour</label>
                            <input name="hour" id="hour" type="time" className="hour_input" required/>
                        </div>

                    <div className="buttons_container">
                        <button type="submit" className="confirm_btn">Confirm</button>
                        <Link href="/diary">
                            <button type="button" className="cancel_btn">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
            {error && <div style={{ color: 'red', marginBottom: 12, textAlign: "center" }}>{error}</div>}
        </>
    );
}