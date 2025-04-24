import { NextResponse } from "next/server";

export async function GET() {
    const response=NextResponse.json({status:200})
    response.cookies.set('token','', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0, // expires immediately
      })
    return response
}