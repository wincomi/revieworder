import Layout from '@/components/layout'
import { Grid, Text, Card, Spacer, Button, Loading, Tooltip } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { MenuAPIGETResponse, MenuItem } from '../api/menus'
import { Menu } from '@prisma/client'
import router from 'next/router'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'

interface StorePageProps {
    menuItems: MenuItem[]
}

export default ({ menuItems }: StorePageProps) => {
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const addToCart = async (index: number) => {
        console.log(menuItems[index])
        setIsAddingToCart(true)

        await fetch(`/api/carts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                menu: menuItems[index] as Menu,
            }),
        })

        setIsAddingToCart(false)

        if (confirm('장바구니로 이동하시겠습니까?')) {
            router.push('/cart')
        }
    }

    if (menuItems == undefined) {
        return (
            <Layout>
                <Text>매장 업데이트 중</Text>
            </Layout>
        )
    }

    return (
        <Layout>
            <Text h3>{menuItems[0].store.name}</Text>

            <Grid.Container gap={2}>
                <Grid sm={12}>
                    {menuItems.map((item: Menu, index) => (
                        <>
                            <Card key={index}>
                                <Card.Body css={{ p: 0, flexGrow: 'unset' }}>
                                    <Card.Image
                                        src={item.image ?? 'http://via.placeholder.com/480x480'}
                                        objectFit="cover"
                                        width="100%"
                                        height={300}
                                        alt="매장 사진"
                                        showSkeleton
                                    />
                                </Card.Body>
                                <Card.Footer>
                                    <Text>{item.name}</Text>
                                    <Text>{item.price.toLocaleString()}원</Text>

                                    <Spacer y={0.5} />
                                    <Tooltip
                                        content="기존의 다른 매장의 물품을 담았을 시 초기화될 수 있습니다."
                                        placement="bottom"
                                        color="invert"
                                    >
                                        <Button
                                            css={{ width: '100%' }}
                                            color="gradient"
                                            icon={<FaShoppingCart />}
                                            onPress={async () => await addToCart(index)}
                                            disabled={isAddingToCart}
                                        >
                                            {isAddingToCart ? (
                                                <Loading type="points" color="currentColor" size="sm" />
                                            ) : (
                                                <>장바구니에 담기</>
                                            )}
                                        </Button>
                                    </Tooltip>
                                </Card.Footer>
                            </Card>
                            <Spacer y={0.5} />
                        </>
                    ))}
                </Grid>
            </Grid.Container>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 검색 쿼리
    const storeId = context.query.store_id ?? ''

    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/menus?storeId=${storeId}`, { method: 'GET' })
    const response = await result.json().then((data) => data as MenuAPIGETResponse)

    const menuItems = response.data

    return {
        props: { menuItems },
    }
}
