import prisma from "@/libs/prismadb"
import { Account, User } from "@prisma/client"

//userId로 insta usernode 찾기
export async function getInstaUser(userId: string) {
    const userResult = await prisma.user.findUnique({
        where: { id: userId },
        select: { accounts: { where: { provider: 'instagram' } } }
    })
    if(userResult==null) return null
    let insta = userResult?.accounts[0]

    return insta
}
//userid로 facebook user 찾기
export async function getFacebookUser(userId: string) {
    const userResult = await prisma.user.findUnique({
        where: { id: userId },
        select: { accounts: { where: { provider: 'facebook' } } }
    })
    if(userResult==null) return null
    let facebook = userResult?.accounts[0]

    return facebook
}
//인스타그램 글쓰기
//image:JPEG만 가능, 24시간 이내 25개까지 게시 가능, 스토리 & 쇼핑 태그 & 브랜디드 콘텐츠 태그 & 필터 & INSTAGRAM TV 게시 불가능
//https://developers.facebook.com/docs/instagram-api/guides/content-publishing
//https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#creating
// ----단일 미디어, 릴스, 슬라이드 게시 가능----
//1.단일 미디어 게시 - 리뷰 폼 구현 후 테스트 필요
export async function postInstagramMedia(account: Account, caption: string, image: string){
    //요청 4회, 포스트 횟수 get / 컨테이너 post / 컨테이너 상태 get / 미디어 post
    let canPost:Response | any = await fetch(`https://graph.facebook.com/${account.providerAccountId}/content_publishing_limit&access_token=${account.access_token}`)
    canPost = await canPost.json()
    if(canPost.data.quota_usage==25){
        return '25개 이상 게시불가능'
    }
    if(caption=='' && image==''){
        return null
    }
    else if(image==''){
        let container = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media?caption=${caption}&access_token=${account.access_token}`
        ,{method: 'POST', 
        })
        container = await container.json()
        console.log(container)
        let status = await fetch(`https://graph.facebook.com/${container}?fields=status_code&access_token=${account.access_token}`)
        status = await status.json()
        console.log(status)
        //if(status.status_code='CANPOST'){
            const media_id = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media_publish?creation_id=${container}&access_token=${account.access_token}`)
        //}
        return await media_id.json()
    }
    else if(caption==''){
        let container = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media?image=${image}&access_token=${account.access_token}`
        ,{method: 'POST', 
        })
        container = await container.json()
        console.log(container)
        let status = await fetch(`https://graph.facebook.com/${container}?fields=status_code&access_token=${account.access_token}`)
        status = await status.json()
        console.log(status)
        //if(status.status_code='CANPOST'){
            const media_id = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media_publish?creation_id=${container}&access_token=${account.access_token}`)
        //}
        return await media_id.json()

    }
    let container = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media?image=${image}&caption=${caption}&access_token=${account.access_token}`
    ,{method: 'POST', 
    //body: JSON.stringify({})
    //credentials: 'include',
    })
    container = await container.json()
    console.log(container)
    let status = await fetch(`https://graph.facebook.com/${container}?fields=status_code&access_token=${account.access_token}`)
    status = await status.json()
    console.log(status)
    //if(status.status_code='CANPOST'){
        const media_id = await fetch(`https://graph.facebook.com/${account.providerAccountId}/media_publish?creation_id=${container}&access_token=${account.access_token}`)
    //}
    return await media_id.json()
}
//2.릴스 게시

//3.슬라이드 게시

//페이스북 글쓰기 - 로그인되지 않은 계정의 access-code를 가져와야함. 어떻게?
//1.페이지
export async function postFacebookPage(account: Account, caption: string, image: string, link:string){
    if(image!=''){
        let pagePostId = await fetch(`https://graph.facebook.com/${process.env.NEXTAUTH_FACEBOOK_ID}/photos?url=${image}&access_token=${account.access_token}`)
        pagePostId = await pagePostId.json()
        return pagePostId
    }
    let pagePostId = await fetch(`https://graph.facebook.com/${process.env.NEXTAUTH_FACEBOOK_ID}/feed?message=${caption}&link=${link}&access_token=${account.access_token}`)
    //리뷰오더 페이스북 페이지 ID, Access-token 구해야함
    pagePostId = await pagePostId.json()
    return pagePostId
}
//2.개인 계정 - 알아보는중..


//피드, 스토리 가져올 필요없음, 글쓰기만 구현
//피드 가져오기
export async function getInstaFeedbyAccount(account: Account){
    const result = await fetch(`https://graph.instagram.com/${account.providerAccountId}/media?fields=id,caption,media_type,media_url,timestamp,permalink,thumbnail_url,username&access_token=${account.access_token}`)
    const feed = await result.json()
    console.log(feed);
    return feed
}
//스토리 가져오기-작동안함
// export async function getStorybyAccount(account: Account){
//     const result = await fetch(`https://graph.instagram.com/${account.providerAccountId}/stories&access_token=${account.access_token}`)
//     const feed = await result.json()
//     console.log(feed);
//     return feed
// }