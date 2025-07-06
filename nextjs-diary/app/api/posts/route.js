import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({items: [{id: 1, title: "Hello"}, {id: 2, title: "World"}]});
}

//export async function POST() {
//    return NextResponse.json({text: "World"})
//}