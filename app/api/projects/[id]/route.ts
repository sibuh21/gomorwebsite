import { NextResponse } from 'next/server';
import prisma from '../../../lib/client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';
// import UploadToPublicFolder from '../upload/local-upload';

export async function DELETE(
  request: Request,
  context: { params: any }
) {
  try {
    const params = await Promise.resolve(context.params);
    const token = (await cookies()).get('token')?.value || '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: any }
) {
  try {
    const params = await Promise.resolve(context.params);
    const token = (await cookies()).get('token')?.value || '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const data = await request.json();
    
    const {
      title,
      description,
      category,
      client,
      location,
      size,
      typology,
      year,
      imageUrls,
      videoUrls
    } = data;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (client !== undefined) updateData.client = client;
    if (location !== undefined) updateData.location = location;
    if (size !== undefined) updateData.size = size;
    if (typology !== undefined) updateData.typology = typology;
    if (year !== undefined) updateData.year = year;
    if (category !== undefined) {
      updateData.category = category === 'ARCHITECTURAL' ? 'ARCHITECTURAL' 
                          : category === 'INTERIOR' ? 'INTERIOR' 
                          : category === 'LANDSCAPE' ? 'LANDSCAPE' 
                          : 'STRUCTURAL';
    }
    if (imageUrls !== undefined) updateData.imagePaths = imageUrls;
    if (videoUrls !== undefined) updateData.videoPaths = videoUrls;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
