import { getLink } from "@/app/lib/data";

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
}