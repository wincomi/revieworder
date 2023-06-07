import router from 'next/router'
import { GetServerSideProps } from 'next/types'

import Layout from '@/components/layout'
import { Button, Card, Grid, Row, Spacer, Text, Tooltip } from '@nextui-org/react'

import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { ReviewAPIGETResponse, ReviewItem } from '../api/reviews'
import { FaStar, FaRegStar, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { ReactNode, useState } from 'react'
import { format } from 'date-fns'
import { Menu, OrderDetail } from '@prisma/client'

interface ReviewPageProps {
    reviews: ReviewItem[]
}

export default function Home({ reviews }: ReviewPageProps) {
    const [reviewItems] = useState(reviews)

    // Components
    const CardFooterTitle = ({ children }: { children: ReactNode }) => {
        return (
            <Text h6 css={{ mt: '$4', mb: '$2' }}>
                {children}
            </Text>
        )
    }

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

    const del = async (review: ReviewItem) => {
        if (confirm('리뷰를 삭제하시겠습니까?')) {
            await fetch(`api/reviews/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    review: review,
                }),
            })
        }

        // 새로고침
        router.reload()
    }

    return (
        <>
            <Layout>
                <Text h1>내 리뷰</Text>
                <Button onPress={() => router.push('/order')} icon={<FaPencilAlt />} flat>
                    리뷰 작성
                </Button>
                <Grid.Container gap={2} alignItems="stretch" css={{ px: 0 }}>
                    {reviewItems.length == 0 && (
                        <Text css={{ m: 16, color: '$colors$neutral' }}>작성된 리뷰가 없습니다.</Text>
                    )}
                    {reviewItems.map((review: ReviewItem) => (
                        <Grid xs={12} sm={6} lg={4} key={review.id}>
                            <Card variant="flat">
                                {/* 리뷰 사진 */}
                                <Card.Body css={{ p: 0, flexGrow: 'unset' }}>
                                    <Card.Image
                                        src={review.image ?? 'http://via.placeholder.com/640x480'}
                                        objectFit="cover"
                                        width="100%"
                                        height={300}
                                        alt="리뷰 사진"
                                        showSkeleton
                                    />
                                </Card.Body>
                                {/* 리뷰 추천, 별점 등 리뷰 정보 */}
                                <Card.Footer css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                                    {/* TODO: 세로 정렬 */}
                                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <Row wrap="wrap" justify="space-between" align="center">
                                            <Spacer />
                                            <Tooltip content={'리뷰어가 선택한 별점'} placement="top" color="warning">
                                                <Button
                                                    auto
                                                    flat
                                                    size="xs"
                                                    color="warning"
                                                    icon={RatingIcons(review.rating)}
                                                >
                                                    ({review.rating}/5)
                                                </Button>
                                            </Tooltip>
                                        </Row>
                                        <Spacer y={0.5} />

                                        <div style={{ alignSelf: 'stretch' }}>
                                            {/* 여기 주석 이전 것 DB에 띄어쓰기 없으면 이거 사용 */}
                                            {/*{review.content.split(" ").map((str) => { */}
                                            {review.content.split('#').map((str: string) => {
                                                if (str != '') str = '#' + str
                                                if (str.startsWith('#')) {
                                                }
                                                return str + ' '
                                            })}
                                        </div>

                                        <CardFooterTitle>주문한 가게</CardFooterTitle>
                                        {/* TODO */}
                                        <Spacer y={0.5} />

                                        <CardFooterTitle>주문한 메뉴</CardFooterTitle>
                                        {review.order.orderDetails?.map((orderDetail: OrderDetail & { menu: Menu }) => (
                                            <Text
                                                key={orderDetail.id}
                                                css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}
                                            >
                                                - {orderDetail.menu.name} &times; {orderDetail.amount}
                                                <br />
                                            </Text>
                                        ))}
                                        <Spacer y={0.5} />
                                    </div>
                                    {/* 유저 정보 및 리뷰 작성 시간 */}
                                </Card.Footer>
                                <Card.Divider />
                                <Card.Footer css={{ color: '$accents7', fontSize: '$xs' }}>
                                    <Row wrap="wrap" justify="space-between" align="center">
                                        작성 시간: {format(new Date(review.createTime), 'yyyy-MM-dd HH:mm:ss')}
                                        <Button
                                            flat
                                            auto
                                            onPress={() => del(review)}
                                            color="error"
                                            size="xs"
                                            icon={<FaTrashAlt fill="currentColor" />}
                                        >
                                            리뷰 삭제
                                        </Button>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions)

    const userId = session?.user.id

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/reviews?userId=${userId}`, { method: 'GET' })
    const response = await result.json().then((data) => data as ReviewAPIGETResponse) // any to ReviewCardProps

    const reviews = response.data

    return {
        props: { reviews },
    }
}
