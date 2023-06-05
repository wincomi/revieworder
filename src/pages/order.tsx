import Layout from '@/components/layout'
import { Button, Card, Grid, Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { OrderAPIGETResponse, OrderItem } from './api/orders'
import { Menu, OrderDetail, Review } from '@prisma/client'
import orderStatusFormat from '@/utils/orderStatusFormat'
import router from 'next/router'
import { ReviewAPIGETResponse } from './api/reviews'

interface OrderPageProps {
    /// 내 리뷰
    reviews: Review[]
    /// 주문 내역
    orderItems: OrderItem[]
}

type orderMenu = OrderDetail & { menu: Menu }

export default ({ reviews, orderItems }: OrderPageProps) => {
    const sumPrice = (order: OrderItem) => {
        const totalPrice = order.orderDetails.reduce((totalPrice, item) => {
            return totalPrice + item.menu.price * item.amount
        }, 0)

        return totalPrice
    }

    if (orderItems == undefined) {
        return (
            <Layout>
                <title>My 주문</title>
                <Text>주문 내역이 없습니다.</Text>
            </Layout>
        )
    }

    // 리뷰 연결이 안 되있다.
    console.log(orderItems)

    const checkReview = (orderId: string) => {
        if (reviews == undefined) {
            return false
        } else {
            for (let i = 0; i < reviews.length; i++) {
                if (reviews[i].orderId == orderId) {
                    return true
                }
            }
            return false
        }
    }

    return (
        <Layout>
            <title>My 주문</title>
            <Grid.Container gap={2} alignItems="flex-start">
                {orderItems.map((order: OrderItem, index) => (
                    <Grid key={index} md={4} xs={6}>
                        <Card>
                            <Card.Header>
                                <Grid>
                                    <Text h5>주문 내역{index + 1}</Text>
                                    <Text>{orderStatusFormat(order.status)}</Text>
                                    {checkReview(order.id) ? (
                                        <Button disabled>리뷰 작성</Button>
                                    ) : (
                                        <Button onPress={() => router.push(`/reviewEnroll?orderId=${order.id}`)}>
                                            리뷰 작성
                                        </Button>
                                    )}
                                </Grid>
                            </Card.Header>
                            <Card.Divider></Card.Divider>
                            <Card.Body>
                                {order.orderDetails.map((orderMenu: orderMenu, index) => (
                                    <Grid key={index}>
                                        <Text>
                                            {orderMenu.menu.name} &nbsp; {orderMenu.amount}개
                                        </Text>
                                        <Text>{(orderMenu.menu.price * orderMenu.amount).toLocaleString()} 원</Text>
                                    </Grid>
                                ))}
                            </Card.Body>
                            <Card.Divider></Card.Divider>
                            <Card.Footer>
                                <Text>총 금액: {sumPrice(order).toLocaleString()}원</Text>
                            </Card.Footer>
                        </Card>
                    </Grid>
                ))}
            </Grid.Container>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // storeId 해당 매장 주문들 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/orders`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })

    const response = await result.json().then((data) => data as OrderAPIGETResponse)
    const orderItems = response.data

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
        props: { reviews, orderItems },
    }
}
