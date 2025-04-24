"use client";

import { useState,useEffect  } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import fav from "../favicon.ico"
import React from "react";
import classNames from "classnames";
import Link from "next/link"
import { usePathname } from "next/navigation";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";



export default function Nav() {
  // const [isHovered, setIsHovered] = useState(false);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const currentPath=usePathname()
  const [role,setRole]=useState("");

    useEffect(()=>{
      async function getUser(){
  
        const res =await fetch("/api/users/isLoggedIn");
        if (res.ok) {
           const data = await res.json();
           setRole(data.user.role);
           console.log("verified user",data.user);

        } else if (res.status===400){
          localStorage.setItem("token","")
          console.log("token expired");
        }

      }
      getUser()
     },[])   

  const handleOpen = () => {
    onOpen();
  };

  

  return (
    <div className="flex items-center">
      {/* Logo / List Icon */}
            <motion.div 
            // onHoverStart={() => setIsHovered(true)}
            // onHoverEnd={() => setIsHovered(false)}
            onClick={() => handleOpen()}
            className="cursor-pointer items-center flex space-x-1"
            >
              <Image 
              src={fav}
              alt="logo image"
              width={30}
              height={30}
              />
              <h1 className="font-bold text-lg items-center">Gomor Architects </h1>
            </motion.div>

      {/* modal appears on left side */}
      {isOpen && (
        
        <Drawer isOpen={isOpen} placement='left' onOpenChange={onOpenChange} size="sm" >
          <DrawerContent>
            {(onClose) => (
              <>
                <DrawerHeader className="flex flex-col gap-1">Menu</DrawerHeader>
                <DrawerBody>
                  
              <div className="min-h-svh  pb-20 font-[family-name:var(--font-geist-sans)]">
                      {
                        (role==='ADMIN')&&
                              <Link href={"/upload"}
                                className={classNames({
                                'text-stone-800 font-bold': "/upload"===currentPath,
                                'hover:text-red-600 font-bold': "/upload"!==currentPath,
                                'transition-colors':true,
                                })}
                                onClick={onClose}
                               > 
                                 Upload Project
                              </Link>
                               
                       }
                    
                </div>
                </DrawerBody>
                <DrawerFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Action
                  </Button>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
       
      )}
    </div>
  );
}
