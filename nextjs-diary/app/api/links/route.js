import { NextResponse } from 'next/server';

import isValidURL from '../../lib/isValidURL';

export async function POST(request) {
    const contentType = await request.headers.get("Content-Type");
    if (contentType !== "application/json") {
        return NextResponse.json({"error": "Invalid Request"}, {status: 415});
    }
    const data = await request.json()    

    const url = data && data.url ? data.url : null
    console.log("url:", url);
    
    const validURL = await isValidURL(url, ["app-router-diary-nzgmd2j5k-hamlets-projects-1fcddcbf.vercel.app", 
        process.env.NEXT_PUBLIC_VERCEL_URL]) 
        console.log("valide", validURL);
        
    if (!validURL) {        
        return NextResponse.json({"message": `${url} is not valid`}, {status: 400});
    }
    return NextResponse.json(data, {status: 201});
}