'use client';
import Link from "next/link";
import Image from "next/image";
import BestHome from "../public/home.webp";
import EnterAnimation from "./components/EnterAnimation";
import { Button } from "@heroui/react";
import Partners from "./components/partners";
import Location from "./components/location";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const categories = [
    {
      href: "/architecture",
      bullet: <EnterAnimation />,
      label: "Architectural Design",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    },
    {
      href: "/interior-design",
      bullet: <EnterAnimation />,
      label: "Interior Design",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    },
    {
      href: "/products",
      bullet: <EnterAnimation />,
      label: "Products",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    },
    {
      href: "/planning",
      bullet: <EnterAnimation />,
      label: "Planning",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
    },
  ];
  
  const testimonials = [
    {
      qoute: "Lorem ipsum dolor sit amet consectetur...",
      qouter: "Nebiyu Daniel",
    },
    {
      qoute: "Lorem ipsum dolor sit amet consectetur...",
      qouter: "Nebiyu Daniel",
    },
    {
      qoute: "Lorem ipsum dolor sit amet consectetur...",
      qouter: "Nebiyu Daniel",
    },
  ];

  const strengths = [
    {
      title: "Quality",
      description: "We follow quality-first approach to ensure design quality.",
    },
    {
      title: "Short Delivery Time",
      description: "We dedicate our time to shorten project delivery time.",
    },
    {
      title: "Optimum cost",
      description: "Our project costs are relatively low.",
    },
  ];

  function handlePress() {
    router.push("/architecture");
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 bg-gray-100 space-y-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl rounded-2xl overflow-hidden bg-gray-900">
        <div className="p-6 md:w-1/2">
          <h1 className="text-2xl font-bold text-center md:text-left text-white md:text-6xl uppercase">Design Your Dream Projects</h1>
          <h2 className="text-base md:text-lg font-medium text-white pt-5" >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi cum deserunt...
          </h2>
          <Button color="primary" onPress={handlePress} className="mt-5"><p className="font-bold text-ellipsis text-wrap">See Projects We Have Done</p></Button>
        </div>
        <div className="md:w-1/2 w-full p-5">
          <Image src={BestHome} alt="Home design" className="w-full h-full object-center rounded-3xl border-white  border-2" />
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex flex-col p-6 w-full max-w-7xl bg-gray-50 rounded-2xl space-y-6">
        <h2 className="text-center text-2xl md:text-3xl font-bold">What we do!</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-4">
          {categories.map((category) => (
            <div key={category.href} className="flex flex-col w-full sm:w-72 bg-white rounded-md p-4 shadow-sm">
              <Link href={category.href} className="text-green-700 font-semibold text-lg">{category.label}</Link>
              <p className="text-sm mt-2">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-7xl bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-6">Testimonials</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="flex flex-col bg-orange-100 p-4 rounded-lg w-full md:w-1/3 shadow">
              <p className="text-sm">{testimonial.qoute}</p>
              <p className="text-right mt-4 font-semibold">— {testimonial.qouter}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="w-full max-w-7xl bg-white rounded-xl overflow-hidden px-10 ">
        <Partners />
      </div>

      {/* Strengths & Location Section */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white p-6 gap-8 rounded-xl shadow-sm">
        <div className="flex-1">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">Our Strengths</h2>
          <ul className="space-y-4">
            {strengths.map((s, index) => (
              <li key={index}>
                <h3 className="font-bold text-lg">{s.title}</h3>
                <p className="text-sm">{s.description}</p>
              </li>
            ))}
            </ul>
        </div>
        <div className="flex-1">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-4">Our Location</h2>
          <Location />
        </div>
      </div>
    </div>
  );
}
