'use server'
import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { LinkFormData } from "../components/LinkForm"
import { SocialLinkFormData } from "../components/SocialLinkModal"

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
        success:true,
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

export const addSocialLink = async(data:SocialLinkFormData)=>{
    const user = await currentUser()

      if (!user) return { success: false, error: "No authenticated user found" };

      const socialLink = await db.socialLink.create({
        data:{
            platform:data.platform,
            url:data.url,
            user:{
                connect:{
                    clerId:user.id
                }
            }
        }
      })

      return {
        sucess:true,
        message:"Social link added successfully",
        data:socialLink
    }
}

export const editSocialLink = async(data:SocialLinkFormData,socialLinkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.socialLink.update({where:{id:socialLinkId , user:{clerId:user.id}},data:data});
    return {sucess:true, message:"Social link updated successfully!"}
}
export const deleteSocialLink = async(socialLinkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.socialLink.delete({where:{id:socialLinkId}});
    return {sucess:true, message:"Social link deleted successfully!"}
}

export const getPreviewData = async()=>{
    const user = await currentUser();

    if (!user) {
        return {
            success: false,
            message: "No authenticated user found",
            data: []
        };
    }

    const links = await db.link.findMany({
        where: {
            user: {
                clerId: user.id
            }
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    username: true,
                    bio: true,
                    imgUrl: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return {
        success: true,
        message: "Gets All Link successfully",
        data: links
    }
}

export const deleteLink = async (linkId: string) => {
    const user = await currentUser();
    if (!user) return { success: false, error: "No authenticated user found" };

    // Find the User record by Clerk ID
    const dbUser = await db.user.findUnique({ where: { clerId: user.id } });
    if (!dbUser) return { success: false, error: "User not found" };

    // Fetch the link to check ownership
    const link = await db.link.findUnique({ where: { id: linkId } });
    if (!link || link.userId !== dbUser.id) {
        return { success: false, error: "Link not found or not authorized" };
    }

    await db.link.delete({ where: { id: linkId } });
    return { success: true, message: "Link deleted successfully!" };
}

export const editLink = async(data:LinkFormData,linkId:string)=>{
    const user = await currentUser();

    if (!user) return { success: false, error: "No authenticated user found" };

    await db.link.update({where:{id:linkId , user:{clerId:user.id}},data:data});
    return {sucess:true, message:"Link updated successfully!"}
}