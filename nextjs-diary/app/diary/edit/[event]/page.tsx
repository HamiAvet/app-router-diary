'use client'

import NavBar from "@/app/ui/navbar/navbar";
import Footer from "@/app/ui/footer/footer";
import { useState, useEffect, FormEvent } from "react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link"
import "./page.css";

// Define the types of error messages
type Errors = {
    dateTimePassedError: string;
    dateError: string;
    topicError: string;
    alreadyExists: string;
}

type Event = {
    id: number;
    topic: string;
    category: string;
    date: string;
    hour: string;
    status: string;
    userId: string;
}

export default function EditEventForm() {
    // State to hold error messages
    const [ errors, setErrors ] = useState<Errors | null>({ 
        dateTimePassedError: "", 
        dateError: "",
        topicError: "",
        alreadyExists: ""
    });

    const [ eventData, setEventData ] = useState<Event | null>(null); // State to hold event data

    /*     
    // Authentication check
    const [checked, setChecked] = useState(false);
    const [isAuthed, setIsAuthed] = useState(false);

    // On component mount, check for user authentication
    useEffect(() => {
        const verifySession = async () => {
            const response = await fetch('/api/sessionProviders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            });
            if (response.status === 200) {
            redirect('/login'); // Redirect to home page if user is not authenticated
            } else {
            setIsAuthed(true); // Mark that user is authenticated
            }
            setChecked(true); // Mark that the check is done
        };
        verifySession();
    }, []);
    
    // If authentication check is not done yet, return null
    if (!checked || !isAuthed) {
      return null; 
    }
    */
    const params = useParams();
    const id = params.event as string;

    useEffect(() => {
        async function fetchEventData() {
            const response = await fetch(`/api/diary/concreteEvent/${id}`, { 
                method: "GET", // Because we are getting data from the server
                headers: {
                    "Content-Type": "application/json"
                },
                // No body needed for GET request
            })
            const result = await response.json(); // Get event data
            console.log(result[0]);
            
            setEventData(result[0]); // Update state with event data
        }
        fetchEventData(); // Call the async function to fetch event data
    }, [id]);
    

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
        // Get event ID from params
        const eventId = id; 

        // Get user ID from local storage
        const userId = localStorage.getItem("userId") || "";
        // Get form data
        const formData = new FormData(event.currentTarget);  
        // Add eventId to form data
        formData.append("id", eventId);
        // Add userId to form data
        formData.append("userId", userId); // Append userId or empty string if userId is null
        // Convert form data to object
        const data = Object.fromEntries(formData); 

        // Create an object with the updated event data
        const updatedData = {id : eventId, userId: userId} as {id: string, userId: string | null, newTopic?: string | null, newCategory?: string, newDate?: string, newHour?: string};
        if (eventData?.topic !== data.topic && typeof data.topic === "string" && data.topic.trim() !== "") {
            updatedData.newTopic = data.topic;
        }
        if (eventData?.category !== data.category && typeof data.category === "string") {
            updatedData.newCategory = data.category;
        }
        if (eventData?.date !== data.date && typeof data.date === "string" && data.date.trim() !== "") {
            updatedData.newDate = data.date;
        }
        if (eventData?.hour !== data.hour && (typeof data.hour === "string" || data.hour === null)) {
            updatedData.newHour = data.hour;
        }
        
        if (Object.keys(updatedData).length === 1) { // If no changes were made
            redirect('/diary'); // Redirect to diary page
        }

        // Define request options
        const options = {
            method: "PUT", // Because we are putting (replaces) data to the server
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data) // The stringified JSON data that we want to send
        }
        
        // Send POST request to create a new diary event
        const response = await fetch(`/api/diary/concreteEvent/${id}`, options);
        
        if (response.status === 400) { // If there are validation errors
            const result = await response.json(); // Get errors          
            // Update state with error messages                
            setErrors({
                dateTimePassedError: result?.dateTimePassedError || "",
                dateError: result?.dateError || "",
                topicError: result?.topicError || "",
                alreadyExists: result?.alreadyExists || ""
            });
        } else if (response.status === 202) { // Else if there are no errors
            redirect('/diary'); // Redirect to diary page            
        }
    };

    // Return the edit event form JSX
    return (
        <>
            <NavBar />
            <div className="editEvent_container">
                <h1>Edit your event</h1>
                <form className="editEvent_form" onSubmit={handleForm}>
                    <div className="input_div">
                        <label htmlFor="topic">Topic</label>
                        <input name="topic" id="topic" type="text" maxLength={60} defaultValue={eventData?.topic || ""} onSubmit={() =>
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
                        <select name="category" defaultValue={eventData?.category || "hobbies"}>
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
                        <input name="date" id="date" type="date" className="date_input" defaultValue={eventData?.date || ""} onChange={() =>
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
                        <input name="hour" id="hour" type="time" className="hour_input" defaultValue={eventData?.hour || ""}/>
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

