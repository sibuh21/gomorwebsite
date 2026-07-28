import { NextResponse } from 'next/server';
import UploadToPublicFolder from '../../projects/upload/local-upload';
import { cookies } from 'next/headers';
import { verifyToken } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const token = (await cookies()).get('token')?.value || '';
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await request.formData();
    const files = data.getAll('files') as File[];
    const videos = data.getAll('videos') as File[];
    const title = data.get('title')?.toString() || `upload-${Date.now()}`;

    const { imageUrls, videoUrls } = await UploadToPublicFolder({ title, files, videos });

    return NextResponse.json({ imageUrls, videoUrls }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
