import { NextResponse } from "next/server";
import prisma from '../../../lib/client'
import { Prisma } from "@prisma/client";

const TYPOLOGY_VALUES = [
    "Culture",
    "Education",
    "Work",
    "Hospitality",
    "Residential",
    "Infrastructure",
    "Space",
    "Sports",
    "Health",
    "Religion",
    "Exhibition",
] as const;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim();
    const typology = searchParams.get("typology")?.trim();

    const normalizedCategory = category?.toUpperCase();
    const requestedTypology = typology?.trim().toLowerCase() ?? "";
    const normalizedTypology = requestedTypology
        ? TYPOLOGY_VALUES.find((value) => value.trim().toLowerCase() === requestedTypology)
        : null;

    const projects = await prisma.project.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    const filteredProjects = projects.filter((project) => {
        const projectCategory = project.category?.toString().toUpperCase();
        const projectTypology = project.typology?.toString().trim().toLowerCase();

        if (normalizedTypology) {
            return projectTypology === requestedTypology;
        }

        if (normalizedCategory && normalizedCategory !== "ALL" && normalizedCategory !== "") {
            return projectCategory === normalizedCategory;
        }

        return true;
    });

    return NextResponse.json(filteredProjects);
}