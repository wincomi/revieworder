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
    image: string,
    link: string
): Promise<string | null | undefined> {
    if (image == '') {
        return '이미지를 등록해주세요'
    }
    image = 'https://i.ibb.co/ynSXzVb/Kakao-Talk-20230612-152444517.jpg'
    /// 페이스북에 연결된 인스타그램 비즈니스 ID 가져오기
    const FACEBOOK_GRAPH_API_URL = `https://graph.facebook.com/v17.0`
    if (account.provider != 'facebook') {
        return '페이스북 로그인이 필요합니다.'
    }
    let response
    const encodedCaption = encodeURIComponent(caption + '\n\n' + link)
    try {
        response = await fetch(
            `${FACEBOOK_GRAPH_API_URL}/${account.providerAccountId}/accounts?fields=instagram_business_account{ig_id}&access_token=${account.access_token}`
        )
    } catch (err) {
        console.log('instagram business account error', err)
        return null
    }
    const accountJSON = await response.json()
    const instagramAccount = accountJSON.data[0].instagram_business_account
    const instagramId = instagramAccount.id
    /// 요청 3회, 컨테이너 post / 컨테이너 상태 get / 미디어 post

    /// container 가져오기
    try {
        response = await fetch(
            `${FACEBOOK_GRAPH_API_URL}/${instagramId}/media?image_url=${image}&caption=${encodedCaption}&access_token=${account.access_token}`,
            { method: 'POST' }
        )
    } catch (err) {
        console.log('get container error', err)
        return null
    }
    const containerJSON = await response.json()
    const containerId = containerJSON.id

    /// 상태 가져오기
    try {
        response = await fetch(
            `${FACEBOOK_GRAPH_API_URL}/${containerId}?fields=status_code&access_token=${account.access_token}`
        )
    } catch (err) {
        console.log('get status_code error', err)
        return null
    }
    const statusJSON = await response.json()
    /// 상태 코드 테스트 필요

    if (statusJSON.status_code != 'FINISHED') {
        console.log('status not finished')
        return null
    }
    try {
        response = await fetch(
            `${FACEBOOK_GRAPH_API_URL}/${instagramId}/media_publish?creation_id=${containerId}&access_token=${account.access_token}`,
            { method: 'POST' }
        )
    } catch (err) {
        console.log('instagram business account error', err)
        return null
    }
    const mediaJSON = await response.json()
    const mediaId = mediaJSON.id
    return mediaId
}

/// TODO: 로그인되지 않은 계정의 access-code를 가져와야함. 어떻게?
/// 1. 페이스북 페이지 글쓰기(리뷰오더 페이지에 포스팅)
export async function postFacebookPage(
    account: Account,
    caption: string, /// 설명
    image: string, /// https://www.revieworder.kr/imagename
    link: string, /// https://www.revieworder.kr/review/reviewId
    pageId: string /// Faccebook Revieworder page ID
): Promise<string | null | undefined> {
    if (image == '' && caption == '') {
        return null
    }
    /// page access token 가져오기 - 1시간짜리 단기 access token으로 충분
    let response
    try {
        response = await fetch(
            `https://graph.facebook.com/${pageId}?fields=name,access_token&access_token=${account.access_token}`
        )
    } catch (err) {
        console.log('get page access token error', err)
        return null
    }
    const pageAccessTokenJSON = await response.json()
    const pageAccessToken = pageAccessTokenJSON.access_token

    const encodedCaption = encodeURIComponent(caption + '\n\n' + link)
    image = 'https://i.ibb.co/ynSXzVb/Kakao-Talk-20230612-152444517.jpg'
    /// 아래 API들은 전부 page access token이 필요함
    if (image != '' && caption != '') {
        try {
            response = await fetch(
                `https://graph.facebook.com/${pageId}/photos?url=${image}&message=${encodedCaption}&access_token=${pageAccessToken}`,
                { method: 'POST' }
            )
        } catch (err) {
            console.log('get pagepostid error', err)
            return null
        }
        const pagePostIdJSON = await response.json()
        return pagePostIdJSON.id
    }
    if (image == '' && caption != '') {
        try {
            response = await fetch(
                `https://graph.facebook.com/${pageId}/feed?message=${encodedCaption}&access_token=${pageAccessToken}`,
                { method: 'POST' }
            )
        } catch (err) {
            console.log('get pagepostid error', err)
            return null
        }
        const pagePostIdJSON = await response.json()
        return pagePostIdJSON.id
    }
}
