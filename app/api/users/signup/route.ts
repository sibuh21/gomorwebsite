import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import prisma from "../../../lib/client"
import bcrypt from "bcryptjs";
import {generateToken} from "../../../lib/auth"

const signupRequest=z.object({
  first_name: z.string().min(3,'firstName is required').max(30),
  last_name: z.string().min(3,'lastName is required').max(30),
  password: z.string().min(4,'password is required').max(10),
  email: z.string().email().endsWith('@gmail.com','email is required'),
  phone: z.string()

});


export async function POST(request:NextRequest){
    const body=await request.json()
    const validation= signupRequest.safeParse(body)
    console.log("body",body)

    if (!validation.success) return NextResponse.json({
      message:validation.error.errors.map((error)=>error.message).join(','),
     },{status:400})
  
  
    const existingUser = await prisma.user.findUnique({
      where:{
        email:body.email}
     });

    if (existingUser) return NextResponse.json(
      {
      message:"User already exists",
    },
      {
      status:400
     });
   
     //hash password
     const hashedPassword =await bcrypt.hash(body.password,10);
  
     const newUser= await prisma.user.create({
      data:{ 
          first_name: body.first_name,
          last_name:body.last_name,
          password:hashedPassword,
          email:body.email,
          phone:body.phone
      }
     })
  
  const token = generateToken(newUser);

  const response= NextResponse.json({status:200 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 1, // 1 hour
    });
  
   return response
};