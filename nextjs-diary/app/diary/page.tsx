import getDomain from "@/app/lib/getDomain"
import Card from "./card"

async function getData() {
  const domain = getDomain()
  const res = await fetch(`${domain}/api/posts`, {cache: 'no-store'})
  if (!res.ok) {
    throw new Error("Falled to fetch data")
  }

  if (res.headers.get("content-type") !== "application/json") {
    return {items: []}
  }
  return res.json()
}

export default async function Diary() {
  const data = await getData()
  const items = data && data.items ? [...data.items] : []
  console.log(items);
  console.log(process.env.NEXT_PUBLIC_VERCEL_URL);
  

  return (
    <div>
      <main>
        <h1>It is your future calendar.</h1>
        <p>Future events: </p>
        {items && items.map((item, index) => {
          return <Card title={item.title} key={`post-${index}`}/>
        })}
      </main>
    </div>
  );
}
