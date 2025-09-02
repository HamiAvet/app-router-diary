import { getSessionUser } from "@/app/lib/session";

export default async function Home() {
  const user = await getSessionUser();
  console.log("User in home page: ", JSON.stringify(user));
  return (
    <div>
      <main>
        <h1>Welcome user : {JSON.stringify(user)}</h1>
      </main>
    </div>
  );
}
