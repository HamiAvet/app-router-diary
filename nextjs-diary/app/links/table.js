'use client'

import useSWR from "swr";
import LinksCreateForm from "./createForm";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function LinksHTMLTable() {
    const { data, error, isLoading, mutate } = useSWR("/api/links", fetcher);
    const didSubmit = (newItem) => {
        mutate();
        console.log("New item was added :", newItem);
    }
    
    if (error) return "An error happening";
    if (isLoading) return "Loading...";

    return (
        <>
        <LinksCreateForm didSubmit={didSubmit} />
        <div>
            <table>
                <tbody>
                    {data && data.map((link, index) => {
                        return <tr key={`link-item-${link.id}-${index}`}>
                            <td>{link.id}</td>
                            <td>{link.url}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
        </>
    )
}

/*
export default async function LinksHTMLTable() {
    const linksResponse = await getLink();

    return (
        <div>
            <table>
                <tbody>
                    {linksResponse && linksResponse.map((link, index) => {
                        return <tr key={`link-item-${link.id}-${index}`}>
                            <td>{link.id}</td>
                            <td>{link.url}</td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}*/