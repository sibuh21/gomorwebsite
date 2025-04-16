import { NextResponse } from 'next/server';
import prisma from '../../../lib/client'
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';
import UploadToCloudinary from './cloudinary';


export async function POST(request: Request) {
  try {
    const token =(await cookies()).get('token')?.value||''
    if (token){
      const vToken= verifyToken(token).payload
        if (vToken&&vToken!=='ADMIN'){
          return NextResponse.redirect(new URL('/not-authorized', request.url));
        }
    }


    const data = await request.formData();
    const files = data.getAll('files') as File[];
    const videos=data.getAll('videos') as File[];
    const title = data.get('title')?.toString()||'';
    const description = data.get('description')?.toString()||'';
    const category=data.get('category')?.toString()||'';
    const client=data.get('client')?.toString()||'';
    const location=data.get('location')?.toString()||'';
    const size=data.get('size')?.toString()||'';
    const typology=data.get('typology')?.toString()||'';
    const year =data.get('year')?.toString()||'';


    const{imageUrls,videoUrls}=await UploadToCloudinary({files,videos})



    // Save to database
    const project = await prisma.project.create({
      data: {
        title: title,
        description: description,
        client:client,
        location:location,
        size:size,
        typology:typology,
        year:year,
        category: category==='ARCHITECTURAL'?'ARCHITECTURAL':category==='INTERIRO'?'INTERIOR':'LANDSCAPE'===category?'LANDSCAPE':'STRUCTURAL',
        imagePaths: imageUrls,
        videoPaths:videoUrls,
      },
    });

    return NextResponse.json(project,{status:201});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


