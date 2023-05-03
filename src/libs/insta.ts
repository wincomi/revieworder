import prisma from "@/libs/prismadb"
import { Account, User } from "@prisma/client"

//userId로 insta usernode 찾기
export default async function getUserNode(userId: string) {
    const userResult = await prisma.user.findUnique({
        where: { id: userId },
        select: { accounts: { where: { provider: 'instagram' } } }
    })
    let insta = userResult?.accounts[0]
    
    // const instaData = await fetch(`https://graph.instagram.com/${insta?.providerAccountId}
    // /media?fields=id,media_type,media_url,permalink,thumbnail_url,username,caption
    // &access_token=${insta?.access_token}`)
    // .then((response)=>response.json())
    // .then((data)=>console.log(data));

    const instagramUserId = 5905537679543297
    const result = await fetch(`https://graph.instagram.com/v16.0/${instagramUserId}?fields=account_type,id,media_count,username&access_token=${insta?.access_token}`)
    console.log(await result.json())
    
    // const result2 = await fetch(`https://graph.instagram.com/me/media?fields=id,caption&access_token=${insta?.access_token}`)
    // const result2Json = await result2.json()
    // const result3 = await fetch(`https://graph.instagram.com/${result2Json.data[0].id}?fields=id,media_type,media_url,username,timestamp&access_token=${insta?.access_token}`)
    // console.log(await result3.json())

    return insta
}
