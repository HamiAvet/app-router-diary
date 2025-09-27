import { getSessionUser } from "@/app/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import "./page.css";

export default async function Home() {
  const user = await getSessionUser();
  if (JSON.stringify(user) !== "{}") {
    redirect('/diary');
  }
  return (
    <div className="home_container">
      <main className="home_main">
        <img src="/fb36ca3d.png" alt="gg" />
        <div className="home_text_container">
          <h1>Diary</h1>
          <p>Welcome to your personal diary. Organize your events and tasks efficiently.</p>
          <div className="buttons_container">
            <Link href="/register">
              <button type="submit" className="singup_btn">Sign Up</button>
            </Link>
            <Link href="/login">
              <button type="button" className="login_btn">Login</button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
