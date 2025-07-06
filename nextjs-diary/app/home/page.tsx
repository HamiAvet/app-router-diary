import getDomain from "@/app/lib/getDomain"

async function getData() {
  const domain = getDomain()
  const res = await fetch(`${domain}/api/posts`)
  if (!res.ok) {
    throw new Error("Falled to fetch data")
  }
  return res.json()
  // return {items: []}
}

export default async function Home() {
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
          return <li key={`post-${index}`}>{item.title}</li>
        })}
      </main>
    </div>
  );
}
