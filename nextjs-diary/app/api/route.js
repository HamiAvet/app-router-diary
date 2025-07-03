import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({text: "Hello"})
}

export async function POST() {
    return NextResponse.json({text: "World"})
}