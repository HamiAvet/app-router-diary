'use client'

import Footer from "@/app/ui/footer/footer";
import { FormEvent } from "react";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link"
import "@/app/diary/create/page.css"

// Define the types of error messages
type Errors = {
    dateTimePassedError: string;
    dateError: string;
    topicError: string;
    alreadyExists: string;
}

export default function CreateEventForm() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({ 
        dateTimePassedError: "", 
        dateError: "",
        topicError: "",
        alreadyExists: ""
    });

    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // On component mount, check for user authentication
    useEffect(() => {
      const user = localStorage.getItem("userId") || null;
      if (!user) {
        redirect('/'); // Redirect to home if not authenticated
      } else {
        setIsAuthed(true); // User is authenticated
      }
        setChecked(true); // Mark that the check is done
    }, []);
    
    // If authentication check is not done yet, return null
    if (!checked || !isAuthed) {
      return null; 
    }

    // Handle form submission
    const handleForm = async (event: FormEvent<HTMLFormElement>) => {  
        event.preventDefault(); // For not reloading the page on form submit

        // Clear previous errors
        setErrors({ 
            dateTimePassedError: "", 
            dateError: "",
            topicError: "",
            alreadyExists: ""
        });
        const userId = localStorage.getItem("userId") || "";
        // Get form data
        const formData = new FormData(event.currentTarget);  
        // Add userId to form data
        formData.append("userId", userId);
        // Convert form data to object
        const data = Object.fromEntries(formData); 
        // Convert data to JSON
        const JSONData = JSON.stringify(data);  

        // Define request options
        const options = {
            method: "POST", // Because we are posting data to the server
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData // The JSON data that we want to send
        }

        // Send POST request to create a new diary event
        const response = await fetch("/api/diary/", options);
        
        if (response.status === 400) { // If there are validation errors
            const result = await response.json(); // Get errors          
            // Update state with error messages                
            setErrors({
                dateTimePassedError: result?.dateTimePassedError || "",
                dateError: result?.dateError || "",
                topicError: result?.topicError || "",
                alreadyExists: result?.alreadyExists || ""
            });            
        } else if (response.status === 201) { // Else if there are no errors
            redirect('/diary'); // Redirect to diary page
        }
    };

    // Return the create event form JSX
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
            <Footer />
        </>
    )
}

