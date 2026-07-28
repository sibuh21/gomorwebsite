import { NextResponse } from 'next/server';
import prisma from '../../../lib/client'
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';
// import UploadToCloudinary from './cloudinary';
// import UploadToPublicFolder from './local-upload';


export async function POST(request: Request) {
  try {
    const token =(await cookies()).get('token')?.value||''
    if (token){
      const vToken= verifyToken(token).payload
        if (vToken&&vToken!=='ADMIN'){
          return NextResponse.redirect(new URL('/not-authorized', request.url));
        }
    }


    const data = await request.json();
    const { 
      title = '', 
      description = '', 
      category = '', 
      client = '', 
      location = '', 
      size = '', 
      typology = '', 
      year = '',
      imageUrls = [],
      videoUrls = []
    } = data;

    // Save to database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        client,
        location,
        size,
        typology,
        year,
        category: category === 'ARCHITECTURAL' ? 'ARCHITECTURAL' : category === 'INTERIOR' ? 'INTERIOR' : category === 'LANDSCAPE' ? 'LANDSCAPE' : 'STRUCTURAL',
        imagePaths: imageUrls,
        videoPaths: videoUrls,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


