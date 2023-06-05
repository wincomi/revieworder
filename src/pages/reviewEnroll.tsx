import Head from 'next/head'
import { Button, Spacer, Input, Textarea, Dropdown } from '@nextui-org/react'
import Layout from '@/components/layout'

import { useState } from 'react'
import { GetServerSideProps } from 'next'
import React from 'react'

import { Prisma } from '@prisma/client'
import { OrderAPIGETResponse, OrderItem } from './api/orders'
import Imgupload from '@/components/imgUpload'
import { FaRegStar, FaStar } from 'react-icons/fa'
import router from 'next/router'

// 메뉴 api upsert 구현해서 기존에 있으면 업데이트, 없으면 생성 -> 기준 (이름, 가격)

interface MenuEditPageProps {
    /// 리뷰 쓸 주문
    orderItem: OrderItem
}

export default function reviewEnroll({ orderItem }: MenuEditPageProps) {
    const [imageUrl, setImageUrl] = useState('/images/default.png')
    const [uploaded, setUploaded] = useState(false)

    const [review, setReview] = useState<Prisma.ReviewCreateInput>({
        content: '',
        image: imageUrl,
        rating: 0,
        order: orderItem as Prisma.OrderCreateNestedOneWithoutReviewInput,
    })

    const RatingIcons = (rating: number) => {
        return (
            <>
                {[...Array(rating)].map((index: number) => {
                    return <FaStar key={index} />
                })}
                {[...Array(5 - rating)].map((index: number) => {
                    return <FaRegStar key={index} />
                })}
            </>
        )
    }

    const create = async () => {
        if (uploaded) {
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
                alert('리뷰 등록 완료.')
                if (confirm('내 리뷰로 이동하시겠습니까?')) {
                    router.push('/review')
                }
            } else {
                alert('리뷰 등록 실패.')
            }
        } else {
            alert('이미지 업로드 해주세요.')
        }
    }

    return (
        <>
            <Head>
                <title>리뷰 등록</title>
            </Head>
            <Layout>
                <form>
                    <fieldset style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                        <Imgupload uploaded={(data) => setUploaded(data)} onChangeImg={(data) => setImageUrl(data)} />
                        <Spacer y={2} />
                        {/* <Button auto flat size="lg" color="warning" icon={RatingIcons(Number(review.rating))}>
                            ({review.rating}/5)
                        </Button> */}
                        <Input
                            type="rating"
                            label="별점"
                            placeholder="0"
                            initialValue={String(review.rating)}
                            shadow={false}
                            fullWidth={true}
                            onChange={(e) => setReview({ ...review, rating: Number(e.currentTarget.value) })}
                        />
                        <Spacer y={2} />
                        <Textarea
                            // 초기 TextArea 크기 ex) 5줄
                            rows={5}
                            label="리뷰 내용"
                            placeholder={''}
                            shadow={false}
                            fullWidth={true}
                            onChange={(e) => setReview({ ...review, content: e.currentTarget.value })}
                        />
                        <Button onPress={create}>리뷰 등록</Button>
                    </fieldset>
                </form>
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

    return {
        props: { orderItem },
    }
}
