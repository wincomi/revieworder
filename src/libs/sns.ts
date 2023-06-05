import { Account } from '@prisma/client'

/// 인스타그램 글쓰기
/// image:JPEG만 가능, 24시간 이내 25개까지 게시 가능, 스토리 & 쇼핑 태그 & 브랜디드 콘텐츠 태그 & 필터 & INSTAGRAM TV 게시 불가능
/// https://developers.facebook.com/docs/instagram-api/guides/content-publishing
/// https://developers.facebook.com/docs/instagram-api/reference/ig-user/media#creating
/// ----단일 미디어, 릴스, 슬라이드 게시 가능----

/// 인스타그램 단일 미디어 게시
/// 이미지는 필수, 캡션은 없을시 빈 string으로
export async function postInstagramMedia(
    account: Account,
    caption: string,
    image: string
): Promise<string | null | undefined> {
    if (image == '/images/default.png') {
        return null
    }
    /// 페이스북에 연결된 인스타그램 비즈니스 ID 가져오기
    const FACEBOOK_GRAPH_API_URL = `https://graph.facebook.com`
    if (account.provider != 'facebook') {
        return null
    }
    const instagram_business_account = await fetch(
        `${FACEBOOK_GRAPH_API_URL}/${account.providerAccountId}/accounts?fields=instagram_business_account{id,name,username}&access_token=${account.access_token}`
    )
    const accountJSON = await instagram_business_account.json()
    const instagramAccount = accountJSON.data[0].instagram_business_account
    const instagramId = instagramAccount.id
    /// 요청 3회, 컨테이너 post / 컨테이너 상태 get / 미디어 post

    /// container 가져오기
    const container = await fetch(
        `${FACEBOOK_GRAPH_API_URL}/${instagramId}/media?image_url=${image}&caption=${caption}&access_token=${account.access_token}`,
        { method: 'POST' }
    )
    const containerJSON = await container.json()
    const containerId = containerJSON.id

    /// 상태 가져오기
    const status = await fetch(
        `${FACEBOOK_GRAPH_API_URL}/${containerId}?fields=status_code&access_token=${account.access_token}`
    )
    const statusJSON = await status.json()
    /// 상태 코드 테스트 필요

    if (statusJSON.status_code != 'FINISHED') {
        return null
    }
    const media = await fetch(
        `${FACEBOOK_GRAPH_API_URL}/${instagramId}/media_publish?creation_id=${containerId}&access_token=${account.access_token}`,
        { method: 'POST' }
    )
    const mediaJSON = await media.json()
    const mediaId = mediaJSON.id
    return mediaId
}

/// TODO: 로그인되지 않은 계정의 access-code를 가져와야함. 어떻게?
/// 1. 페이스북 페이지 글쓰기(리뷰오더 페이지에 포스팅)
export async function postFacebookPage(
    account: Account,
    caption: string,
    image: string,
    link: string,
    pageId: string
): Promise<string | null | undefined> {
    if (image == '' && caption == '') {
        return null
    }
    /// page access token 가져오기 - 1시간짜리 단기 access token으로 충분
    const getpageAccessToken = await fetch(
        `https://graph.facebook.com/${pageId}?fields=name,access_token&access_token=${account.access_token}`
    )
    const pageAccessTokenJSON = await getpageAccessToken.json()
    const pageAccessToken = pageAccessTokenJSON.access_token
    /// 아래 API들은 전부 page access token이 필요함
    if (image != '/images/default.png' && caption != '') {
        const pagePostId = await fetch(
            `https://graph.facebook.com/${pageId}/photos?url=${image}&message=${caption}&link=${link}&access_token=${pageAccessToken}`,
            { method: 'POST' }
        )
        const pagePostIdJSON = await pagePostId.json()
        return pagePostIdJSON.id
    }
    if (image == '/images/default.png' && caption != '') {
        const pagePostId = await fetch(
            `https://graph.facebook.com/${pageId}/feed?message=${caption}&link=${link}&access_token=${pageAccessToken}`,
            { method: 'POST' }
        )
        const pagePostIdJSON = await pagePostId.json()
        return pagePostIdJSON.id
    }
}

/// 피드, 스토리 가져올 필요없음, 글쓰기만 구현
/// 피드 가져오기
// export async function getInstaFeedbyAccount(account: Account) {
//     const result = await fetch(
//         `https://graph.instagram.com/${account.providerAccountId}/media?fields=id,caption,media_type,media_url,timestamp,permalink,thumbnail_url,username&access_token=${account.access_token}`
//     )
//     const feed = await result.json()
//     console.log(feed)
//     return feed
// }
