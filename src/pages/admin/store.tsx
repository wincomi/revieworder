import Layout from '@/components/admin/layout'
import { Grid, Text, Link, Button } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { MenuAPIGETResponse, MenuItem } from '../api/menus'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import StoreSelection from '@/components/admin/storeSelection'
import router from 'next/router'

// TODO: 메뉴 표시 + selection 사용 (처음에는 가지고 있는 첫 매장으로 이동 이후 셀렉터로 이동) + 메뉴 관리로 이동 + 매장 설정 변경

// 매장은 있는데 메뉴 등록을 아예 안 한 경우??? -> 매장, 메뉴 따로따로 불러와야?
interface adminStorePageProps {
    storeInfo: StoreInfo | StoreInfo[]
    menuItems: MenuItem[]
}

export default function adminStorePage({ storeInfo, menuItems }: adminStorePageProps) {
    // 매장 없을 시
    if (storeInfo == undefined) {
        return (
            <>
                <Layout>
                    <Link href="/admin">홈</Link>
                    <Link href="/admin">매장 등록</Link>
                </Layout>
            </>
        )
    }

    // storeInfo 타입이 StoreInfo[] 이면 (storeId 쿼리가 안 왔을 때 동작)
    if (Array.isArray(storeInfo)) {
        return (
            <>
                <Layout>
                    <Link href="/admin">홈</Link>
                    <StoreSelection stores={storeInfo as StoreInfo[]} />
                </Layout>
            </>
        )
    } else {
        // 매장 있고 메뉴 등록 안 했을 시
        if (menuItems == undefined) {
            return (
                <>
                    <Layout>
                        <Text h3>{storeInfo.name}</Text>
                        <Link href="/admin">홈</Link>
                        <Link href="/admin">메뉴 등록</Link>
                    </Layout>
                </>
            )
        }

        return (
            <>
                <Layout>
                    <Text h3>매장 관리</Text>
                    <Text>{storeInfo.name}</Text>
                    <Grid.Container xs={12} sm={6} gap={2}>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Text>메뉴 목록</Text>
                            </Grid>

                            <Grid>
                                <Button onPress={() => router.push('/admin/menuUpdate')}>메뉴 등록</Button>
                            </Grid>
                        </Grid.Container>
                        {menuItems.map((menu: MenuItem, index) => (
                            <Grid key={index}>
                                <Link href={`/admin/menuUpdate?id=${menu.id}`}>{menu.name}</Link>
                                <Text>
                                    {'('} {menu.status == 'AVAILABLE' ? '판매가능' : '판매 불가'} {')'}
                                </Text>
                                <Text>{menu.price.toLocaleString()}원</Text>
                            </Grid>
                        ))}
                    </Grid.Container>
                </Layout>
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const storeId = context.query.id ?? ''

    // storeId 해당 매장 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/stores?id=${storeId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as StoreAPIGETResponse)
    const storeInfo = response.data

    // storeId 해당 매장 메뉴들 정보
    const menuResult = await fetch(`${process.env.NEXTAUTH_URL}/api/menus?storeId=${storeId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const menuRes = await menuResult.json().then((data) => data as MenuAPIGETResponse)
    const menuItems = menuRes.data

    return {
        props: { storeInfo, menuItems },
    }
}
