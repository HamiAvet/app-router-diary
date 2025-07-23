'use client'

//import { getLink } from "@/app/lib/data";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LinksHTMLTable() {
    const { data, error, isLoading } = useSWR("/api/links", fetcher, {refreshInterval: 1000})
    console.log(data);
    
    if (error) return "An error happening"
    if (isLoading) return "Loading..."

    return (
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