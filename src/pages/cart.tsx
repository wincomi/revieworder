import Layout from "@/components/layout"
import { Button, Grid, Row, Col, Text, Card, Spacer } from '@nextui-org/react'
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { Key, useState } from "react"

import CartCard, { CartCardType, CartCardComponentProps } from '@/components/cartCard'

import { TbPigMoney } from 'react-icons/tb'
import { useRouter } from "next/router"

interface CartPageProps {
    cartCards: CartCardType[]
}

export default function Cart({ cartCards }: CartPageProps) {
    const session = useSession()
    const router = useRouter()
    const [cartItems, setCartItems] = useState(cartCards)
    const [totalPrice, setTotalPrice] = useState(0)

    const setCardItem = (data, index: Key)=> {
        const updateCart = cartItems.map((item, idx) =>{
            if(idx === index) {
                return data
            }
            else return item
        })
        setCartItems(updateCart)
    }

    // TODO: 나중에 장바구니 담긴 거 없을 때 default 화면 정해야함?
    return (
        <Layout>
            <Text h1>장바구니</Text>
                <Grid.Container gap={2} justify="flex-start" css={{px: 0}}>
                    <Row justify="space-between">
                        <Col>
                        {cartItems.map((item: CartCardType, index: Key) => (
                            <Grid>
                                <CartCard 
                                    key={index} 
                                    cartCard={item}
                                    onChangeCartItem={(data)=>setCardItem(data,index)}
                                />
                            </Grid>
                        ))}
                        </Col>

                    <Grid xs={6} md={6}>
                        <Card variant="flat">
                            <Card.Body css={{ p: 0 }}>
                                <Grid justify="center">
                                {cartItems.map((item: CartCardType, index: Key) => (
                                    <>
                                    <Row justify="space-between">
                                        <Text>{item.menu.name} x {item.count}</Text>
                                        <Text>{(item.menu.price * item.count).toLocaleString()}</Text>
                                    </Row>
                                    <Spacer y={0.2} />
                                    </>
                                ))}
                                </Grid>
                            </Card.Body>
                            <Card.Divider />

                            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                                <Col>
                                <Row justify="flex-end"><Text h2>{totalPrice}원</Text></Row>
                                    <Row>
                                        <Button color="gradient">주문 하기</Button>
                                        <Spacer y={0.5} />
                                        <Button color="gradient" onClick={()=>router.back()}>돌아가기</Button>
                                    </Row>
                                </Col>
                            </Card.Footer>
                        </Card>
                    </Grid>
                    </Row>
                </Grid.Container>
                
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/carts/posts/`,{
        method: "GET",
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || "",
          }
    })
    const cartCards = await result.json().then(data => data as CartCardType) 

    //console.log(cartCards)

    return {
        props: { cartCards }
    }
}

