import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const response=NextResponse.json({status:200})
    response.cookies.set('token','', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0, // expires immediately
      })
    return response
}