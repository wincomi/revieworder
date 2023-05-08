import Layout from "@/components/layout"
import { Grid, Text, Spacer } from '@nextui-org/react'

import Head from "next/head"
import { GetServerSideProps } from "next"
import { SetStateAction, useEffect, useState } from "react"

import CartCard from '@/components/cart/cartCard'
import SummaryCard from "@/components/cart/summaryCard"
import { CartAPIGETResponse, CartItem } from "./api/carts"
import router from "next/router"

interface CartPageProps {
    carts: CartItem[]
}

export default function CartPage({ carts }: CartPageProps) {
    const [cartItems, setCartItems] = useState(carts)
    const [totalPrice, setTotalPrice] = useState(0)

    const setCardItem = (data: SetStateAction<CartItem | null>, index: number) => {
        if (data == null) {
            // data가 null이면 index를 삭제함
            const updateCart = cartItems.slice(index, 1)

            setCartItems(Object.assign(updateCart))
        } else {
            const updateCart = cartItems.map((item, idx) => {
                if (idx === index) {
                    return data
                }
                else return item
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
                    "Content-Type": "application/json",
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    carts: cartItems
                })
            })
        }

        result()
    }, [cartItems])

    // 주문 기능
    const onPressOrderButton = async () => {
        const result = await fetch(`api/orders`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                carts: cartItems,
                money: totalPrice
            })
        })

        const Moneyresult = await fetch(`api/user/moneyapi`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
            },
            // session의 쿠키 전달
            credentials: 'include',
            body: JSON.stringify({
                userId: cartItems[0].userId,
                money: totalPrice,
                opt: 'pay'
            })
        })

        // if (confirm('주문내역으로 이동하시겠습니까?')) {
        router.push('/order')
        // }
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
                            onPressOrderButton={onPressOrderButton}
                        />
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/carts/`, {
        method: "GET",
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || "",
        }
    })

    const response = await result.json().then(data => data as CartAPIGETResponse)
    const carts = response.data

    return {
        props: { carts }
    }
}
