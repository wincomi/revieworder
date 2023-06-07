import Layout from '@/components/layout'
import { Grid, Text, Card, Spacer, Button, Loading, Row, Modal } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { MenuAPIGETResponse, MenuItem } from '../api/menus'
import { Menu } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import QRCode from 'react-qr-code'
import Head from 'next/head'
import { HiQrcode } from 'react-icons/hi'

interface StorePageProps {
    menuItems: MenuItem[]
}

export default ({ menuItems }: StorePageProps) => {
    const router = useRouter()
    const [visibleQRCode, setVisibleQRCode] = useState(false)

    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const addToCart = async (index: number) => {
        if (confirm('다른 매장의 물품을 담았을 시 초기화될 수 있습니다.')) {
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
    }

    if (menuItems == undefined) {
        return (
            <Layout>
                <Text>매장 업데이트 중</Text>
            </Layout>
        )
    }

    return (
        <>
            <Head>
                <title>{menuItems[0].store.name}</title>
            </Head>

            <Layout>
                <Text h1>{menuItems[0].store.name}</Text>
                <Button onPress={() => setVisibleQRCode(true)} icon={<HiQrcode />} flat css={{ mb: 12 }}>
                    매장 QR코드 보기
                </Button>
                <Modal open={visibleQRCode} onClose={() => setVisibleQRCode(false)}>
                    <Modal.Body>
                        <QRCode value={document.URL} size={400} style={{ width: '100%' }} />
                    </Modal.Body>
                </Modal>

                <Grid.Container>
                    <Grid sm={12}>
                        {menuItems.map((item: Menu, index) => (
                            <>
                                <Card key={index} variant="flat">
                                    <Card.Header>
                                        <Row wrap="wrap" justify="space-between" align="center">
                                            <Text h3 css={{ mb: 0 }}>
                                                {item.name}
                                            </Text>
                                            <Text h4 css={{ mb: 0 }}>
                                                {item.price.toLocaleString()}원
                                            </Text>
                                        </Row>
                                    </Card.Header>
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
                                    </Card.Footer>
                                </Card>
                                <Spacer y={0.5} />
                            </>
                        ))}
                    </Grid>
                </Grid.Container>
            </Layout>
        </>
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
