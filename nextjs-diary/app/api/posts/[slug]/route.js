import { NextResponse } from 'next/server'

export async function GET(request, context) {
    const params = await context.params;
    const { slug } = params
    console.log(request, context);
    return NextResponse.json({slug: slug})
}
