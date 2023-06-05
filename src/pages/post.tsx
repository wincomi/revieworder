import Layout from '@/components/layout'
import React, { useState } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { GetServerSideProps } from 'next/types'
import { postFacebookPage, postInstagramMedia } from '@/libs/sns'
import { Button, Grid, Textarea } from '@nextui-org/react'
import { Account } from '@prisma/client'
import { getUserAccount } from '@/libs/users'
import { AiFillFacebook, AiFillInstagram } from 'react-icons/ai'
import { HiOutlinePencil } from 'react-icons/hi'
import Imgupload from '@/components/imgUpload'

export type PostReviewPageProps = {
    account: Account
    pageId: string
}

/// TODO
/// 1. 디자인 수정
/// 2. 이미지URL, link 입력 추가
/// 3. SNS POST 버튼 선택으로 변경
export default ({ account, pageId }: PostReviewPageProps) => {
    const [imageUrl, setImageUrl] = useState('/images/default.png')
    const [uploaded, setUploaded] = useState(false)
    const [content, setContent] = useState('')

    const postReview = async (provider: string) => {
        if (uploaded) {
            const link = 'https://www.revieworder.kr'
            if (provider == 'instagram') {
                const postId = await postInstagramMedia(account, content, imageUrl)
                console.log(postId)
            } else if (provider == 'facebook') {
                const postId = await postFacebookPage(account, content, imageUrl, link, pageId)
                console.log(postId)
            }
        }
    }

    return (
        <>
            <Layout>
                <Textarea
                    label="리뷰 내용"
                    placeholder="리뷰 내용을 입력하세요."
                    initialValue={content}
                    onChange={(e) => setContent(e.target.value)}
                    minRows={4}
                    css={{ width: '100%' }}
                />
                <Imgupload uploaded={(data) => setUploaded(data)} onChangeImg={(data) => setImageUrl(data)} />
                <Grid.Container gap={2}>
                    <Grid></Grid>
                    <Grid>
                        <Button onPress={() => postReview('facebook')} icon={<AiFillFacebook />}>
                            페이스북 리뷰 작성
                        </Button>
                    </Grid>
                    <Grid>
                        <Button color="gradient" onPress={() => postReview('instagram')} icon={<AiFillInstagram />}>
                            인스타그램 리뷰 작성
                        </Button>
                    </Grid>
                    <Grid>
                        <Button flat onPress={() => postReview('instagram')} icon={<HiOutlinePencil />}>
                            일반 리뷰 작성
                        </Button>
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        return {
            /// 추후 return null 없애버리고 redirect to login page로 처리
            props: {
                account: null,
                pageId: process.env.NEXTAUTH_FACEBOOK_PAGE_ID,
            },
        }
    }
    const userId = session?.user?.id
    /// Facebook 계정 하나로 instagram까지 전부 가능 (instagram 계정으로는 instagram post 불가능)
    /// 반드시 Facebook 계정으로만 로그인해야함
    const facebook = await getUserAccount(userId, 'facebook')
    if (!facebook) {
        return {
            props: {
                account: null,
                pageId: process.env.NEXTAUTH_FACEBOOK_PAGE_ID,
            },
        }
    }
    return {
        props: {
            account: facebook,
            pageId: process.env.NEXTAUTH_FACEBOOK_PAGE_ID,
        },
    }
    /// 현재 facebook과 instagram의 user.id가 개인마다 여러개라서 해당 쿼리는 불가능
    /// DB에 개인 user 묶음을 추가하면 한번에 여러곳의 sns에 연동이 가능하다
    /// 근데 OAuth DB 건드리는거라 가능할진 몰?루
}
