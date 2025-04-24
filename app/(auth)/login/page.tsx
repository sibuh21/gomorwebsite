"use client";
import axios from "axios";
import { useState } from "react";
import {Spinner} from "@heroui/react"
import {Input, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
 const Login=()=>{
    const [param,setParam]=useState({password:"",email:""});
    const[processing,setProcessing]=useState(false);
    const [err,setErr]=useState('');

    const handleSubmit=async (e:React.FormEvent)=>{
        e.preventDefault();
        setProcessing(true);
        try{
            await axios.post('/api/users/login',param)
            setErr('')
            setParam({password:"",email:""})
            addToast({
                title: "User Login",
                description: "Log in successful",
                color: "success",
              })
            //   router.replace('/')
               window.location.replace('/')
        }catch(err:any){
            setErr(err.response.data.message)
            addToast({
                title: "User Login",
                description: err.response.data.message,
                color: "danger",
                timeout:5000,
                radius:"md"
              })
        }finally{
            setProcessing(false)
        }

    }
    return <div className="flex flex-col items-center mt-4">
        {/* <div>
            
        </div>
        <div> */}
        {!processing? <form className="flex flex-col w-full max-w-[384px] md:w-96 h-auto space-y-3" onSubmit={handleSubmit}>
            
            {err&&  <p className="bg-red-700 text-white text-center border-1 p-2 rounded-md">{err}</p>}
            <p className="text-bold text-center">Login</p>
            <Input 
                label="Email" 
                type="email"
                className="p-2 border rounded"

                onChange={(e)=>setParam({...param,email:e.target.value})}
            />
            <Input
                className="p-2 border rounded"
                type="password"
                placeholder="Password"
                onChange={(e)=>setParam({...param,password:e.target.value})}

            /> 
            <Button color="primary" type="submit">Login</Button>
        </form>:<Spinner classNames={{label: "text-foreground mt-4"}} label="simple" variant="simple" />}  
        </div>
    // </div>
}
export default Login