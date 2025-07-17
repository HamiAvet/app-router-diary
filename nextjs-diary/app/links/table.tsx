import { getLink } from "@/app/lib/data";

export default async function LinksHTMLTable() {
    const linksResponse = await getLink();

    return (
        <div>
            {linksResponse && JSON.stringify(linksResponse)}
        </div>
    )
}