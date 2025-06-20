import ListProjects from "@/app/components/listProjects";
import prisma from "./lib/client";
export default async function Architecture() {
  const data = await prisma.project.findMany();

  return (
    <>
    <ListProjects data={data} />
    </>
  );
}
