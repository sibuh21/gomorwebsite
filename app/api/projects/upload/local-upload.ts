// Process files
import path from 'path';
import { promises as fs } from 'fs';
async function UploadToPublicFolder({title,files,videos}:{title:string,files:File[],videos:File[]}){
    const videoDir = path.join(process.cwd(), 'public', 'uploads',`${title}`,'videos');
    const imageDir = path.join(process.cwd(), 'public', 'uploads',`${title}`,'images');

    await fs.mkdir(videoDir, { recursive: true });
    await fs.mkdir(imageDir, { recursive: true });

    const imageUrls = [];
    const videoUrls = [];

    for (const file of files) {
    if (typeof file === 'string') continue;
    
    const buffer = await file.arrayBuffer();
    const filename = `${Date.now()}-${file.name}`;

    const filePath = path.join(imageDir, filename);

    await fs.writeFile(filePath, Buffer.from(buffer));

    imageUrls.push(`/uploads/${title}/images/${filename}`);
    
    }
    for (const video of videos){
    if (typeof video==='string') continue;

    const buffer = await video.arrayBuffer();
    const filename = `${Date.now()}-${video.name}`;
    const filePath = path.join(videoDir, filename);
    await fs.writeFile(filePath, Buffer.from(buffer));

    videoUrls.push(`/uploads/${title}/videos/${filename}`);
    
    }
    return{imageUrls,videoUrls}
}
export default UploadToPublicFolder