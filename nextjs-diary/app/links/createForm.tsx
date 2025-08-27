'use client'

import { FormEvent } from "react";
import { useState } from "react";

export default function LinksCreateForm({didSubmit} : {didSubmit?: (newItem: {url: string, key: string}) => void}) {
    const [ results, setResults ] = useState(null)

    const handleForm = async (event:FormEvent<HTMLFormElement> ) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        const JSONData = JSON.stringify(data);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body : JSONData
        }

        const respons = await fetch("/api/links", options)
        const result = await respons.json()
        
        setResults(result.url)
        console.log(typeof didSubmit);
        if (didSubmit) {
            didSubmit(result)
        }
        
    }

    return (
        <form onSubmit={handleForm}>
            <input type="text" defaultValue="https://github.com/
            HamiAvet/app-router-diary" name="url"/>
            <label htmlFor="event">URL</label>
            <button type="submit">submit</button>
            {results && JSON.stringify(results)}
        </form>
    )
}