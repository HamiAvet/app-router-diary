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
    alreadyExists: string;
}

export default function CreateEventForm() {
    const [ errors, setErrors ] = useState<Errors | null>({ 
        dateTimePassedError: "", 
        dateError: "",
        topicError: "",
        alreadyExists: ""
    });
    
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {  
        event.preventDefault();  
        setErrors({ 
            dateTimePassedError: "", 
            dateError: "",
            topicError: "",
            alreadyExists: ""
        });

        const formData = new FormData(event.currentTarget);  
        const data = Object.fromEntries(formData); 
        
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
            setErrors({
                dateTimePassedError: result?.dateTimePassedError || "",
                dateError: result?.dateError || "",
                topicError: result?.topicError || "",
                alreadyExists: result?.alreadyExists || ""
            });            
        } else if (response.status === 201) {
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
                                    ...(prev ?? { dateTimePassedError: "", dateError: "", topicError: "", alreadyExists: "" }),
                                    dateTimePassedError: "",
                                    dateError: "",
                                    topicError: "",
                                    alreadyExists: ""
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
                                    ...(prev ?? { dateTimePassedError: "", dateError: "", topicError: "", alreadyExists: "" }),
                                    dateTimePassedError: "",
                                    dateError: "",
                                    topicError: "",
                                    alreadyExists: ""
                                }))
                            }/>
                        { errors?.dateError && <p className="error_message">{errors.dateError}</p> }
                    </div>
                    <div className="input_div">
                        <label htmlFor="hour">Hour *</label>
                        <input name="hour" id="hour" type="time" className="hour_input" />
                        { errors?.dateTimePassedError && <p className="error_message">{errors.dateTimePassedError}</p> }
                        { errors?.alreadyExists && <p className="error_message">{errors.alreadyExists}</p> }                        
                    </div>

                    <div className="buttons_container">
                        <button className="confirm_btn" type="submit">Confirm</button>
                        <Link href="/diary">
                            <button className="cancel_btn" type="button">Cancel</button>
                        </Link>
                    </div>
                    <p style={{fontSize: "12px"}}>* = Optional</p>
                </form>
            </div>
        </>
    )
}

