'use client'

import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import "@/app/diary/create/page.css"

type Errors = {
    dateTimePassedError: string;
    dateError: string;
    topicError: string;
}

export default function CreateEventForm() {
    const [ errors, setErrors ] = useState<Errors | null>({ 
        dateTimePassedError: "", 
        dateError: "",
        topicError: "" 
    });
    
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {  
        event.preventDefault();  
        setErrors({ 
            dateTimePassedError: "", 
            dateError: "",
            topicError: "" 
        });

        const formData = new FormData(event.currentTarget);  
        const data = Object.fromEntries(formData); 
        
        /*const newErrors = {
            dateTimePassedError: "",
            dateError: "",
            topicError: ""
        };

        if (!data.topic) {
            newErrors.topicError = "Topic cannot be empty"
        }

        if (!data.date) {
            newErrors.dateError = "Date is required"
        }

        const now = new Date();
        let eventDateTime;
        const eventDate = String(data.date);
        const eventHour = String(data.hour);

        if (!eventHour) {
            eventDateTime = new Date(`${eventDate}T00:00`);
        } else {
            eventDateTime = new Date(`${eventDate}T${eventHour}`);       
        } 

        if (eventDateTime < now) {
            newErrors.dateTimePassedError = "The selected date and time has already passed"
        }

        if (newErrors.dateTimePassedError || newErrors.dateError || newErrors.topicError) {
            setErrors({
                dateTimePassedError: newErrors.dateTimePassedError,
                dateError: newErrors.dateError,
                topicError: newErrors.topicError
            });
            return;
        }*/

        const JSONData = JSON.stringify(data);  
        console.log(JSONData);  

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const response = await fetch("/api/diary/", options);
        if (response.status === 400) {
            const result = await response.json();    
            console.log(result);
                    
            setErrors({
                dateTimePassedError: result.dateTimePassedError || "",
                dateError: result.dateError || "",
                topicError: result.topicError || ""
                
            });            
        } else if (response.status === 201) {
            console.log("ok")
            router.push('/diary');
        }
   };

    return (
        <>
            <div className="createEvent_container">
                <h1>Create a new event</h1>
                <form className="createEvent_form" onSubmit={handleForm}>
                    <div className="input_div">
                        <label htmlFor="topic">Topic</label>
                        <input name="topic" id="topic" type="text" maxLength={60} onSubmit={() =>
                                setErrors(prev => ({
                                    ...(prev ?? { dateTimePassedError: "", dateError: "", topicError: "" }),
                                    dateTimePassedError: "",
                                    dateError: "",
                                    topicError: ""
                                }))
                            }/>
                        { errors?.topicError && <p className="error_message">{errors.topicError}</p> }
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
                        <input name="date" id="date" type="date" className="date_input" onChange={() =>
                                setErrors(prev => ({
                                    ...(prev ?? { dateTimePassedError: "", dateError: "", topicError: "" }),
                                    dateTimePassedError: "",
                                    dateError: "",
                                    topicError: ""
                                }))
                            }/>
                        { errors?.dateError && <p className="error_message">{errors.dateError}</p> }
                    </div>
                    <div className="input_div">
                        <label htmlFor="hour">Hour *</label>
                        <input name="hour" id="hour" type="time" className="hour_input" />
                    </div>
                    { errors?.dateTimePassedError && <p className="error_message">{errors.dateTimePassedError}</p> }
                    <div className="buttons_container">
                        <button className="confirm_btn" type="submit">Confirm</button>
                        <Link href="/diary">
                            <button className="cancel_btn" type="button">Cancel</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    )
}

