import Layout from '@/components/layout'
import { Grid, Text, Spacer, Button } from '@nextui-org/react'

import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { SetStateAction, useEffect, useState } from 'react'

import CartCard from '@/components/cart/cartCard'
import SummaryCard from '@/components/cart/summaryCard'
import { CartAPIGETResponse, CartItem } from './api/carts'
import { FaTrashAlt } from 'react-icons/fa'

interface CartPageProps {
    carts: CartItem[]

    /// TOSS_CLIENT_KEY
    tossClientKey: string

    /// NEXTAUTH_URL
    tossRedirectURL: string
}

export default function CartPage({ carts, tossClientKey, tossRedirectURL }: CartPageProps) {
    const [cartItems, setCartItems] = useState(carts)

    const setCardItem = (data: SetStateAction<CartItem | null>, index: number) => {
        if (data == null) {
            // data가 null이면 index를 삭제함
            const updateCart = cartItems.slice(index, 1)

            setCartItems(Object.assign(updateCart))
        } else {
            const updateCart = cartItems.map((item, idx) => {
                if (idx === index) {
                    return data
                } else return item
            })

            setCartItems(Object.assign(updateCart))
        }
    }
    // 값(amount) 변경 시 자동 업데이트
    useEffect(() => {
        const result = async () => {
            await fetch(`api/carts/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    carts: cartItems,
                }),
            })
        }

        result()
    }, [cartItems])

    const resetCart = async () => {
        if (confirm('장바구니를 초기화하겠습니까?')) {
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
        // TODO: 새로고침 추가
    }

    if (cartItems.length == 0) {
        return (
            <>
                <Head>
                    <title>장바구니</title>
                </Head>
                <Layout>
                    <Text h1>장바구니</Text>
                    <p>장바구니가 비어있습니다.</p>
                </Layout>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>장바구니</title>
            </Head>
            <Layout>
                <Text h1>장바구니</Text>
                {/* TODO: 버튼 위치 수정하기 */}
                <Button auto color="error" icon={<FaTrashAlt fill="currentColor" />} onPress={resetCart}></Button>
                <Grid.Container gap={2} alignItems="flex-start">
                    <Grid md={8} xs={12}>
                        <div style={{ width: '100%' }}>
                            {cartItems.map((cartItem: CartItem, index: number) => (
                                <div key={cartItem.id}>
                                    <CartCard
                                        key={cartItem.id}
                                        cartItem={cartItem}
                                        onChangeCartItem={(data) => setCardItem(data, index)}
                                    />
                                    <Spacer />
                                </div>
                            ))}
                        </div>
                    </Grid>
                    <Grid md={4} xs={12}>
                        <SummaryCard
                            cartItems={cartItems}
                            tossClientKey={tossClientKey}
                            tossRedirectURL={tossRedirectURL}
                        />
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/carts/`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || '',
        },
    })

    const response = await result.json().then((data) => data as CartAPIGETResponse)
    const carts = response.data

    return {
        props: {
            carts: carts,
            tossClientKey: process.env.TOSS_CLIENT_KEY,
            tossRedirectURL: process.env.NEXTAUTH_URL,
        },
    }
}
