'use client'

import { use } from "react";
import { notFound } from "next/navigation";

export default function DiaryPostEvent({params}: {params: Promise<{slug: string}> }) {
  const { slug } = use(params)

  if (!slug || slug !== "create") {
    notFound()
  }
  
  return (
    <div>
      <main>
        <h1>A new slug: {slug}</h1>
        <input type="text" name="event"/>
        <label htmlFor="event">event</label>
        <input type="date" name="date"/>
        <label htmlFor="date">date</label>
      </main>
    </div>
  );
}
