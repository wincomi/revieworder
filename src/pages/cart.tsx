import Layout from "@/components/layout"
import { Button, Grid, Row, Text, Card, Spacer } from '@nextui-org/react'
import { GetServerSideProps } from "next"
import { useSession } from "next-auth/react"
import { Key, SetStateAction, useState } from "react"

import CartCard, { CartCardType } from '@/components/cartCard'

import { useRouter } from "next/router"
import { FaRegCreditCard } from "react-icons/fa"

interface CartPageProps {
    cartCards: CartCardType[]
}

export default function CartPage({ cartCards }: CartPageProps) {
    const session = useSession()
    const router = useRouter()
    const [cartItems, setCartItems] = useState(cartCards)
    const [totalPrice, setTotalPrice] = useState(0)

    const setCardItem = (data: SetStateAction<CartCardType>, index: Key)=> {
        const updateCart = cartItems.map((item, idx) =>{
            if(idx === index) {
                return data
            }
            else return item
        })
        setCartItems(Object.assign(updateCart))
    }

    // TODO: 나중에 장바구니 담긴 거 없을 때 default 화면 정해야함?
    return (
        <Layout>
            <Text h1>장바구니</Text>
            <Grid.Container gap={2} alignItems="flex-start">
                <Grid md={8} xs={12}>
                    <div style={{ width: '100%' }}>
                        {cartItems.map((item: CartCardType, index: Key) => (
                            <>
                                <CartCard 
                                    key={index} 
                                    cartCard={item}
                                    onChangeCartItem={(data)=>setCardItem(data,index)}
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
                            {cartItems.map((item: CartCardType, index: Key) => (
                                <>
                                <Row justify="space-between">
                                    <Text>{item.menu.name} x {item.amount}</Text>
                                    <Text>{(item.menu.price * item.amount).toLocaleString()}</Text>
                                </Row>
                                <Spacer y={0.2} />
                                </>
                            ))}
                            </Grid>
                        </Card.Body>
                        <Card.Divider />
                        <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                            <div style={{ width: '100%' }}>
                                <Text h2 style={{textAlign: 'right'}}>{(totalPrice).toLocaleString()}원</Text>
                                <Button color="gradient" css={{ width: '100%' }} icon={<FaRegCreditCard />}>주문하기</Button>
                            </div>
                        </Card.Footer>
                    </Card>
                </Grid>
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

