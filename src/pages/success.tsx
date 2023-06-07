import Layout from '@/components/layout'
import { Button, Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import router from 'next/router'
import { CartAPIGETResponse } from './api/carts'

export default function SuccessPage() {
    return (
        <>
            <Layout>
                <Text h1>결제 성공</Text>
                <Button auto flat css={{ h: '100%' }} onPress={() => router.push('/profile')}>
                    돌아가기
                </Button>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    await getSession(context)

    // 장바구니 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/carts/`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })

    const response = await result.json().then((data) => data as CartAPIGETResponse)
    const cartItems = response.data

    const totalPrice = cartItems.reduce((totalPrice, item) => {
        return totalPrice + item.menu.price * item.amount
    }, 0)

    // URL 쿼리
    const paymentKey = context.query.paymentKey
    const amount = context.query.amount
    const orderId = context.query.orderId
    const userId = context.query.userId

    // 결제 방식: 바로 결제, 포인트 결제
    const pointPay = context.query.payMethod

    // 토스 결제 승인 시 시크릿키 사용
    const secretKey = process.env.TOSS_SECRET_KEY
    if (secretKey != undefined) {
        //basic64로 인코딩
        const basic64 = Buffer.from(secretKey, 'utf8').toString('base64')

        // 결제 승인 api
        await fetch('https://api.tosspayments.com/v1/payments/confirm', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic64}`,
                'Content-Type': 'application/json',
                // session의 쿠키 전달
                cookie: context.req.headers.cookie || '',
            },
            body: JSON.stringify({
                paymentKey: paymentKey,
                amount: amount,
                orderId: orderId,
            }),
        }).then(async (res) => {
            if (res.status == 200) {
                // 결제승인 성공 후 리뷰머니 충전 - 결제 승인은 한번만 되서 새로고침해도 충전x
                console.log('성공')

                // 조건문 넣rl
                if (pointPay == 'true') {
                    await fetch(`${process.env.NEXTAUTH_URL}/api/user/moneyapi`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            // session의 쿠키 전달
                            cookie: context.req.headers.cookie || '',
                        },
                        body: JSON.stringify({
                            userId: userId,
                            money: Number(amount),
                            opt: 'charge',
                        }),
                    })
                } else if (pointPay == 'false') {
                    await fetch(`${process.env.NEXTAUTH_URL}/api/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // session의 쿠키 전달
                            cookie: context.req.headers.cookie || '',
                        },
                        body: JSON.stringify({
                            carts: cartItems,
                            money: totalPrice,
                        }),
                    })

                    // 주문 후 장바구니 초기화
                    await fetch(`api/carts`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        // session의 쿠키를 보내는데 req가 없으면 필요
                        credentials: 'include',

                        body: JSON.stringify({
                            cart: cartItems[0],
                            reset: true,
                        }),
                    })
                }
            }
        })
    }

    return {
        props: {},
    }
}
