import { NextRequest, NextResponse } from "next/server";
import prisma from '../../../lib/client'



export async function GET(request:NextRequest){
    // const { searchParams } = new URL(request.url);

    // const category = searchParams.get("category") as Prisma.EnumCategoryFilter 
    const projects =await prisma.project.findMany()
    return NextResponse.json(projects)
}