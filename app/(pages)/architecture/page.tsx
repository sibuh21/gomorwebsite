import ListProjects from "@/app/components/listProjects";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import prisma from "../../lib/client";

export default async function Architecture() {
  const data = await prisma.project.findMany({
    where: {
      category: "ARCHITECTURAL",
    },
  });

  return (
    <>
      <NavBar />
      <ListProjects data={data} />
      <Footer />
    </>
  );
}
