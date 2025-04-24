'use client'
import { Button } from "@heroui/react";
const Logout = () => {
    const handleLogout = async () => {
        await fetch('/api/users/logout');
        // router.replace('/')
        window.location.replace('/')
        
      };
    return (
        <Button onPress={handleLogout} className="bg-gray-900 text-white">
              Logout
        </Button>
      );
}
 
export default Logout;