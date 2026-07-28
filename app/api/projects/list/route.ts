import { NextResponse } from "next/server";
import prisma from '../../../lib/client'
import { Prisma } from "@prisma/client";



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let where: any = {};

    // If category is provided and not "all", filter projects
    if (category && category !== "ALL" && category !== "all" && category !== "") {
        where.category = category;
    }

    // Find projects with the optional filter
    const projects = await prisma.project.findMany({
        where: where,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return NextResponse.json(projects);
}