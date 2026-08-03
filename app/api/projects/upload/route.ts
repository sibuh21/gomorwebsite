import { NextResponse } from 'next/server';
import prisma from '../../../lib/client'
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';

const VALID_TYPOLOGIES = new Set([
  'Culture',
  'Education',
  'Work',
  'Hospitality',
  'Residential',
  'Infrastructure',
  'Space',
  'Sports',
  'Health',
  'Religion',
  'Exhibition',
]);

const MAX_TOTAL_MEDIA_ITEMS = 20;

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

    const normalizedTypology = typeof typology === 'string' ? typology.trim() : '';
    if (!VALID_TYPOLOGIES.has(normalizedTypology)) {
      return NextResponse.json(
        { error: 'Invalid typology value' },
        { status: 400 }
      );
    }

    const totalMediaItems = Number((imageUrls || []).length) + Number((videoUrls || []).length);
    if (totalMediaItems > MAX_TOTAL_MEDIA_ITEMS) {
      return NextResponse.json(
        { error: `You can upload up to ${MAX_TOTAL_MEDIA_ITEMS} images and videos in total.` },
        { status: 400 }
      );
    }

    // Save to database
    const project = await prisma.project.create({
      data: {
        title,
        description,
        client,
        location,
        size,
        typology: normalizedTypology,
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


