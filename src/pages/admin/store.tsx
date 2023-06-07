import Layout from '@/components/admin/layout'
import { Grid, Text, Link, Button, Spacer, Card, Row } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { MenuAPIGETResponse, MenuItem } from '../api/menus'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import StoreSelection from '@/components/admin/storeSelection'
import router from 'next/router'
import { FaBan, FaCheck, FaPlus } from 'react-icons/fa'

// TODO: 메뉴 관리로 이동 + 매장 설정 변경

interface AdminStorePageProps {
    storeInfos: StoreInfo[]
    storeId: number | null
    menuItems: MenuItem[] | null
}

export default function adminStorePage({ storeInfos, storeId, menuItems }: AdminStorePageProps) {
    // 매장 없을 시
    if (storeInfos == undefined) {
        return (
            <>
                <Layout>
                    <Text h1>매장 관리</Text>
                    <Link href="/admin">매장 등록</Link>
                </Layout>
            </>
        )
    }

    const queryString = `store=${storeId}`

    return (
        <>
            <Layout>
                <Text h1>매장 관리</Text>
                <StoreSelection stores={storeInfos} />
                <Spacer />
                <Grid.Container gap={2}>
                    {menuItems && (
                        <>
                            {menuItems.map((item: MenuItem, index) => {
                                return (
                                    <Grid key={index} xs={12} sm={4}>
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
                                                    color={item.status == 'AVAILABLE' ? 'success' : 'error'}
                                                    icon={item.status == 'AVAILABLE' ? <FaCheck /> : <FaBan />}
                                                    size="sm"
                                                    css={{ ml: 'auto' }}
                                                >
                                                    {item.status == 'AVAILABLE' ? '판매가능' : '판매 불가'}
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </Grid>
                                )
                            })}
                            <Spacer />
                            <Button
                                onPress={() => router.push('/admin/update_menu?' + queryString)}
                                flat
                                icon={<FaPlus />}
                            >
                                메뉴 등록
                            </Button>
                        </>
                    )}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 모든 매장 정보
    const allStoreResult = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stores`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const allStoreResponse = await allStoreResult.json().then((data) => data as StoreAPIGETResponse)
    const storeInfos = allStoreResponse.data

    // storeId 해당 매장 메뉴들 정보
    const storeId = context.query.id
    if (storeId != undefined) {
        const menuResult = await fetch(`${process.env.NEXTAUTH_URL}/api/menus?storeId=${storeId}`, {
            method: 'GET',
            headers: {
                // session의 쿠키 전달
                cookie: context.req.headers.cookie || '',
            },
        })
        const menuResponse = await menuResult.json().then((data) => data as MenuAPIGETResponse)
        const menuItems = menuResponse.data

        return {
            props: { storeInfos: storeInfos, storeId: storeId, menuItems },
        }
    }

    return {
        props: { storeInfos: storeInfos, storeId: null, menuItems: null },
    }
}
