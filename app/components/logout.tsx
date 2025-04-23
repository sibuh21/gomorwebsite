'use client'
import { Button } from "@heroui/react";
import {useRouter} from 'next/navigation'
const Logout = () => {
    const router=useRouter()
    const handleLogout = async () => {
        await fetch('/api/users/logout');
        router.push('/');
      };
    return (
        <Button onPress={handleLogout} className="bg-gray-900 text-white">
              Logout
        </Button>
      );
}
 
export default Logout;