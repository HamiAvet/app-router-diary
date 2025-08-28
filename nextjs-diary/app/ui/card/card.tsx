'use client'

import './card.css'

import { useState, useEffect} from "react"
import Image from "next/image"
import { useSearchParams } from 'next/navigation';
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Card({ currentPage }: { currentPage: number }) {
    const [ status, setStatus ] = useState<{[key: number]: string}>({});    
    const { data, error, isLoading } = useSWR("/api/diary/", fetcher, {refreshInterval: 1000});
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    console.log(status);
    

    
    type Event = {
        id: number;
        topic: string;
        category: string;
        date: string;
        hour: string;
        status: string;
    };

    const Categories: { [key: string]: string } = {
        hobbies: "#8e44ad",
        work: "#427ffa",
        health: "orange",
        shopping: "#e67e22",
        sport: "#16a085",
        administrative: "#c0392b",
        household: "#7f8c8d",
        festivities: "#f1c40f"
    };

    
    useEffect(() => {
        if (!data?.length) return;
        const now = new Date();

        data.forEach((event: Event) => {
            const eventDateTime = new Date(`${event.date}T${event.hour}`);                    
            if (eventDateTime < now) {            
                handleDelete(event.id);
            } 
        });

    }, [data])

    const handlesStatus = async (event: Event) => {
        setStatus(prev => ({
            ...prev,
            [event.id]: prev[event.id] === "Done" ? "Active" : "Done"
        }));

        await fetch(`/api/diary/${(event.id, event.status)}`, { 
            method: 'PUT', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ event })
        });
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/diary/${id}`, { 
            method: 'DELETE', 
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id })
        });
    };


    if (error) return "An error happening";
    if (isLoading) return "Loading...";

    if (!data?.length) {
        return <div className="no_events">No events planned</div>;
    }

    const filteredEvents = data.filter((event: Event) => event.topic.toLowerCase().includes(query.toLowerCase()));  
    const eventsPerPage = 6;
    const page = currentPage && currentPage > 0 ? currentPage : 1;
    const startIndex = (page - 1) * eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
        
    return (  
        <>  
            {paginatedEvents.length > 0 ? paginatedEvents.map((event: Event, index: number) => (  
              <div className="event" key={`event-item-${event.id}-${index}`}>  
                    <h3 className="date">{event.date}</h3>  
                    <div className="event_container">  
                        <div className="main_event">  
                            <div className="event_detail">  
                                <div className="hour_case">  
                                    <p className="hour">{event.hour}</p>  
                                </div>  
                                <div className="category_case">  
                                    <p className="category" style={{ background: Categories[event.category] }}>{event.category}</p>  
                            </div>  
                            <div className="topic_case">  
                                <p className="topic">{event.topic}</p>  
                            </div>  
                            <div className="state_case">  
                                <button
                                    onClick={() => handlesStatus(event)}
                                    className="state"
                                    style={{ background: event.status === "Active" ? "#427ffa" : "limegreen" }}>
                                    {event.status}
                                </button>
                            </div>  
                        </div>  
                    </div>  
                    <button className="delete" onClick={() => handleDelete(event.id)}>
                        <Image src="/delete-bin-7-line.svg" alt="delete" width={20} height={20} />
                    </button>  
                </div>  
            </div>  
            )) : (<div className="no_events">No events planned</div>)}  
            <div className='pagination'>
                {page > 1 ? (
                    <button className='previous' style={{width: "25px"}} onClick={() => window.location.search = `?page=${page - 1}`}>
                        <Image style={{background: "#fff", border: "none", textDecoration: "none"}} src="/arrow-left-s-line.svg" alt="previous" width={20} height={20} />
                    </button>
                ) : (
                    <button className='previous' style={{width: "25px"}} disabled>
                        <Image src="/arrow-left-s-line.svg" alt="previous" width={20} height={20} />
                    </button>
                )}
                {<p>{page + " / " + totalPages}</p>}
                {filteredEvents.length > startIndex + eventsPerPage ? (
                    <button className='next' style={{width: "25px"}} onClick={() => window.location.search = `?page=${page + 1}`}>
                        <Image src="/arrow-right-s-line.svg" alt="next" width={20} height={20} />
                    </button>
                ) : (
                    <button className='next' style={{width: "25px"}} disabled>
                        <Image src="/arrow-right-s-line.svg" alt="next" width={20} height={20} />
                    </button>
                )}
                </div>
        </>  
    );  
}  
