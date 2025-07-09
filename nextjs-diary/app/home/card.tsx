'use client'

import { useState } from "react"

export default function Card({title}: {title: string}) {
    const [ status, setStatus ] = useState("Active");

    const handleStatus = (event:React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        setStatus("Done")
    }
    if (!title) {return <div>Empty</div>}
    return (
        <div>
            <h1>{title}</h1>
            <button onClick={handleStatus}>{status}</button>
        </div>
    )
}