'use client'

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GithubProfile() {
    const myGithubRepoProfile = "https://api.github.com/repos/HamiAvet/app-router-diary"
    const { data, error, isLoading } = useSWR(myGithubRepoProfile, fetcher)
    console.log(data);
    
    if (error) return "An error happening"
    if (isLoading) return "Loading..."

    return (
        <div>
            <h1>{data.name}</h1>
        </div>
    )
}