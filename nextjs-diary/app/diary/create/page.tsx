'use client'

import { FormEvent } from "react";
import { useState } from "react";

export default function createEventForm() {
    const [ results, setResults ] = useState(null)

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {  
       event.preventDefault();  
       const formData = new FormData(event.currentTarget);  
       
       const data = Object.fromEntries(formData);  
       console.log(data);  
       const JSONData = JSON.stringify(data);  
       console.log(JSONData);  

       const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const respons = await fetch("/api/diary/", options)
        const result = await respons.json()
        console.log(result);
        
        setResults(result)
   };

    return (
        <form className="createEvent_container" onSubmit={handleForm}>
            <div className="topic_input_div">
                <label htmlFor="topic">Topic</label>
                <input name="topic" id="topic" type="text" className="topic_input" maxLength={60} />
            </div>
            <div>
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
            <div>
                <div>
                    <label htmlFor="date">Date</label>
                    <input name="date" id="date" type="date" className="date_input" />
                </div>
                <div>
                    <label htmlFor="hour">Hour</label>
                    <input name="hour" id="hour" type="time" className="hour_input" />
                </div>
            </div>
            <div>
                <button type="submit">Confirm</button>
                <button>Cancel</button>
            </div>
        </form>
        
    )
}