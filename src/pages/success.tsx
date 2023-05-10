import Layout from '@/components/layout'
import { Button, Text } from '@nextui-org/react'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import router from 'next/router'

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
    const session = await getSession(context)

    // URL 쿼리
    let paymentKey = context.query.paymentKey
    let amount = context.query.amount
    let orderId = context.query.orderId
    let userId = context.query.userId

    // 토스 결제 승인 시 시크릿키 사용
    const secretKey = process.env.TOSS_SECRET_KEY
    let basic64

    if (secretKey != undefined) {
        //basic64로 인코딩
        basic64 = Buffer.from(secretKey, 'utf8').toString('base64')
    }
    // 결제 승인 api
    const result = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
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
        }
    })

    return {
        props: {},
    }
}
