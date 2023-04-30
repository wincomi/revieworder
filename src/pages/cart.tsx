import Layout from "@/components/layout"
import { Button, Grid, Row, Text, Card, Spacer } from '@nextui-org/react'
import { FaRegCreditCard } from "react-icons/fa"

import { GetServerSideProps } from "next"
import { Key, SetStateAction, useEffect, useState } from "react"

import CartCard from '@/components/cartCard'
import { CartAPIGETResponse, CartItem } from "./api/carts"
import router from "next/router"

interface CartPageProps {
    carts: CartItem[]
}

export default function CartPage({ carts }: CartPageProps) {

    const getTotalPrice = (cartItems: CartItem[]) => {
        return cartItems.reduce((totalPrice, item) => {
            return totalPrice + item.menu.price * item.amount
        }, 0)
    }
    
    const [cartItems, setCartItems] = useState(carts)
    const [totalPrice, setTotalPrice] = useState(getTotalPrice(cartItems))

    const setCardItem = (data: SetStateAction<CartItem>, index: Key) => {
        const updateCart = cartItems.map((item, idx) => {
            if (idx === index) {
                return data
            }
            else return item
        })

        setCartItems(Object.assign(updateCart))

        setTotalPrice(getTotalPrice(cartItems))
    }

    // 값(amount) 변경 시 자동 업데이트 
    useEffect(() => {
        const result = async() => {
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
    },[cartItems])

    // 주문 기능
    const orderMenu = async () => {
        const result = await fetch(`api/orders`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                carts: cartItems
            })
        })

        if (confirm('주문내역으로 이동하시겠습니까?')) {
            router.push('/order')
        }
    }


    if (cartItems.length == 0) {
        return (
            <Layout>
                <Text h1>장바구니</Text>
                <p>장바구니가 비어있습니다.</p>
            </Layout>
        )
    } else {
        return (
            <Layout>
                <Text h1>장바구니</Text>
                <Grid.Container gap={2} alignItems="flex-start">
                    <Grid md={8} xs={12}>
                        <div style={{ width: '100%' }}>
                            {cartItems.map((cartItem: CartItem, index: Key) => (
                                <>
                                    <CartCard 
                                        key={index} 
                                        cartItem={cartItem}
                                        onChangeCartItem={(data) => setCardItem(data, index)}
                                    />
                                    <Spacer />
                                </>
                            ))}
                        </div>
                    </Grid>
                    <Grid md={4} xs={12}>
                        <Card variant="flat">
                            <Card.Body css={{ p: 0 }}>
                                <Grid justify="center">
                                    {cartItems.map((cartItem: CartItem, index: Key) => (
                                        <>
                                            <Row justify="space-between">
                                                <Text>{cartItem.menu.name} x {cartItem.amount}</Text>
                                                <Text>{(cartItem.menu.price * cartItem.amount).toLocaleString()}</Text>
                                            </Row>
                                            <Spacer y={0.2} />
                                        </>
                                    ))}
                                </Grid>
                            </Card.Body>
                            <Card.Divider />
                            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                                <div style={{ width: '100%' }}>
                                    <Text h2 style={{textAlign: 'right'}}>
                                        {totalPrice.toLocaleString()}원
                                    </Text>
                                    <Button 
                                        color="gradient"
                                        css={{ width: '100%' }} 
                                        icon={<FaRegCreditCard />} 
                                        onPress={ async () => await orderMenu() }>
                                            주문하기
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Grid>
                </Grid.Container>
            </Layout>
        )
    }
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
