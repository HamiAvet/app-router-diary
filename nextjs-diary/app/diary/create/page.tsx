'use client'

import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import "@/app/diary/create/page.css"

export default function CreateEventForm() {
    const [ error, setError ] = useState<string | null>(null);
    const router = useRouter();


    const handleForm = async (event: FormEvent<HTMLFormElement>) => {  
       event.preventDefault();  
       const formData = new FormData(event.currentTarget);  
       
       const data = Object.fromEntries(formData);  
       console.log(data);  
       const JSONData = JSON.stringify(data);  
       console.log(JSONData);  

       const now = new Date();
       const eventDate = String(data.date);
       const eventHour = String(data.hour);
       const eventDateTime = new Date(`${eventDate}T${eventHour}`);
       if (eventDateTime < now) {
            setError("The chosen date or time has already passed");
            return; 
        }

       const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const response = await fetch("/api/diary/", options);

        if (response.ok) {
            router.push('/diary');
        }
        

   };

    return (
        <div className="createEvent_container">
            <h1>Create a new event</h1>
            <form className="createEvent_form" onSubmit={handleForm}>
                <div className="input_div">
                    <label htmlFor="topic">Topic</label>
                    <input name="topic" id="topic" type="text" maxLength={60} required/>
                </div>
                <div className="input_div">
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
                <div className="input_div">
                    <label htmlFor="date">Date</label>
                    <input name="date" id="date" type="date" className="date_input" required/>
                </div>
                <div className="input_div">
                    <label htmlFor="hour">Hour</label>
                    <input name="hour" id="hour" type="time" className="hour_input" required/>
                </div>
                <div className="buttons_container">
                    <button className="confirm_btn" type="submit">Confirm</button>
                    <Link href="/diary">
                        <button className="cancel_btn" type="button">Cancel</button>
                    </Link>
                </div>
                {error && <div className="error_message">{error}</div>}
        </form>
            
        </div>
        
    )
}

