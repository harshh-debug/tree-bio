import { logProfileVist } from '@/modules/analytics/actions';
import { getUserByUsername } from '@/modules/profile/actions';
import TreeBioProfile from '@/modules/profile/components/TreeBioProfile';
import { redirect } from 'next/navigation';
import React from 'react'

const profilePage =  async({params}:{params:Promise<{username:string}>}) => {
    const {username} = await params;
    const profileData = await getUserByUsername(username)
    if (profileData?.username !== username) {
    return redirect("/")
    }
    logProfileVist(profileData.id).catch((e)=>{
        console.error("Failed to Log profile visit:",e);
    })
    return (
        //@ts-expect-error
        <TreeBioProfile profileData={profileData} />
    )
}

export default profilePage
