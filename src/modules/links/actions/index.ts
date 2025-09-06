'use server'
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { LinkFormData } from "../components/LinkForm"

export const createLinkByUser=async(data:LinkFormData)=>{
    const user=await currentUser()
    if(!user) return{
        success:false,
        error:"No authenticated user found"
    }
    const link = await db.link.create({
        data:{
            title:data.title,
            url:data.url,
            description:data.description,
            clickCount:0,
            user:{
                connect:{
                    clerId:user.id
                }
            }
        }
    })
    return{
        sucess:true,
        message:"Link created Successfully",
        data:link
    }
}

export const getAllLinkForUser = async()=>{
    const user=await currentUser()
    const links=await db.link.findMany({
        where:{
            user:{
                clerId:user?.id
            }
        },
        select:{
            id:true,
            title:true,
            description:true,
            url:true,
            clickCount:true,
            createdAt:true,
        }
    })
    return {
        success:true,
        message:"Gets All Link successfully",
        data:links
    }
}