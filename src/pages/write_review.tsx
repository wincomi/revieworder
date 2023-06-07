import Head from 'next/head'
import { Button, Spacer, Input, Textarea, Checkbox, Card, Row, Text } from '@nextui-org/react'
import Layout from '@/components/layout'

import { useState } from 'react'
import { GetServerSideProps } from 'next'
import React from 'react'
import { getUserAccount } from '@/libs/users'

import { Account, Prisma, Review } from '@prisma/client'
import { OrderAPIGETResponse, OrderItem } from './api/orders'
import ImageUploadButton from '@/components/ImageUploadButton'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { HiPencilAlt } from 'react-icons/hi'
import { ReviewAPIGETResponse } from './api/reviews'
import router from 'next/router'

// 메뉴 api upsert 구현해서 기존에 있으면 업데이트, 없으면 생성 -> 기준 (이름, 가격)

interface MenuEditPageProps {
    /// 리뷰 확인용(write or not)
    reviews: Review[]
    /// 리뷰 쓸 주문
    orderItem: OrderItem
    account: Account | null
    pageId: string
}

export default ({ reviews, orderItem, account, pageId }: MenuEditPageProps) => {
    const [imageUrl, setImageUrl] = useState('/images/default.png')
    const [uploaded, setUploaded] = useState(false)
    const [reviewId, setReviewId] = useState(0)
    const [selectedFacebook, setSelectedFacebook] = React.useState(false)
    const [selectedInstagram, setSelectedInstagram] = React.useState(false)

    const [review, setReview] = useState<Prisma.ReviewCreateInput>({
        content: '',
        image: imageUrl,
        rating: 1,
        order: orderItem as Prisma.OrderCreateNestedOneWithoutReviewInput,
    })

    const writeReview = async () => {
        const result = await fetch(`/api/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',
            body: JSON.stringify({
                inputReview: review,
            }),
        })
        if (result.status == 200) {
            alert('리뷰를 등록하였습니다.')
        } else {
            alert('리뷰 등록에 실패하였습니다.')
        }
    }

    const orderId = router.query.orderId

    for (let i = 0; i < reviews.length; i++) {
        if (reviews[i].orderId == orderId) {
            return (
                <Layout>
                    <title>리뷰 작성</title>
                    <Text>이미 작성된 리뷰입니다.</Text>
                </Layout>
            )
        }
    }

    return (
        <>
            <Head>
                <title>리뷰 작성</title>
            </Head>
            <Layout>
                <Card variant="flat" css={{ mx: 'auto', maxW: 640 }}>
                    <Card.Header>
                        <Text h3 css={{ mb: 0 }}>
                            리뷰 작성
                        </Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body>
                        <form>
                            <fieldset style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                                <ImageUploadButton
                                    uploaded={(data) => setUploaded(data)}
                                    onChangeImage={(data) => setImageUrl(data)}
                                />
                                <Spacer y={1} />
                                <Input
                                    type="number"
                                    label="별점 (1점 ~ 5점 사이로 입력해주세요.)"
                                    initialValue={String(review.rating)}
                                    underlined
                                    fullWidth={true}
                                    onChange={(e) => setReview({ ...review, rating: Number(e.currentTarget.value) })}
                                />
                                <Spacer y={2} />
                                <Textarea
                                    // 초기 TextArea 크기 ex) 5줄
                                    rows={5}
                                    label="리뷰 내용"
                                    placeholder="여기에 작성할 리뷰를 입력해주세요."
                                    underlined
                                    fullWidth={true}
                                    onChange={(e) => setReview({ ...review, content: e.currentTarget.value })}
                                />
                            </fieldset>
                        </form>
                    </Card.Body>
                    <Card.Divider />
                    <Card.Footer css={{ justifyItems: 'flex-start' }}>
                        <Row wrap="wrap" justify="space-between" align="center">
                            <Checkbox isSelected={selectedFacebook} onChange={setSelectedFacebook} size="xs">
                                Facebook 동시 등록
                            </Checkbox>
                            <Checkbox
                                isSelected={selectedInstagram}
                                onChange={setSelectedInstagram}
                                color="gradient"
                                size="xs"
                            >
                                Instagram 동시 등록
                            </Checkbox>
                            <Spacer />
                            <Button onPress={writeReview} icon={<HiPencilAlt />} color="gradient">
                                리뷰 등록
                            </Button>
                        </Row>
                    </Card.Footer>
                </Card>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const orderId = context.query.orderId ?? ''

    // 주문 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/orders?id=${orderId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as OrderAPIGETResponse)
    const orderItem = response.data

    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        return {
            props: {
                orderItem,
                account: null,
                pageId: process.env.NEXTAUTH_FACEBOOK_PAGE_ID,
            },
        }
    }

    const userId = session?.user?.id
    /// Facebook 계정 하나로 instagram까지 전부 가능 (instagram 계정으로는 instagram post 불가능)
    /// 반드시 Facebook 계정으로만 로그인해야함
    const facebook = await getUserAccount(userId, 'facebook')

    const reviewResult = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })

    const reviewRes = await reviewResult.json().then((data) => data as ReviewAPIGETResponse)
    const reviews = reviewRes.data

    return {
        props: {
            reviews,
            orderItem,
            account: facebook != undefined ? facebook : null,
            pageId: process.env.NEXTAUTH_FACEBOOK_PAGE_ID,
        },
    }
}
