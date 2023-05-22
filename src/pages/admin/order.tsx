import Layout from '@/components/admin/layout'
import { GetServerSideProps } from 'next'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import { OrderAPIGETResponse, OrderItem } from '../api/orders'
import Link from 'next/link'
import { Grid, Text } from '@nextui-org/react'
import StoreSelection from '@/components/admin/storeSelection'
import { format } from 'date-fns'
import { Menu, OrderDetail } from '@prisma/client'

interface adminOrderPageProps {
    selectedStore: StoreInfo
    storesInfo: StoreInfo[]
    orders: OrderItem[]
}

export default ({ selectedStore, storesInfo, orders }: adminOrderPageProps) => {
    // 매장 없을 시
    if (storesInfo == undefined) {
        return (
            <>
                <Layout>
                    <Link href="/admin">홈</Link>
                    <Link href="/admin">매장 등록</Link>
                </Layout>
            </>
        )
    }

    if (selectedStore == undefined) {
        return (
            <>
                <Layout>
                    <Link href="/admin">홈</Link>
                    <StoreSelection stores={storesInfo as StoreInfo[]} />
                </Layout>
            </>
        )
    } else if (orders == undefined) {
        return (
            <>
                <Layout>
                    <Text h3>주문 관리</Text>
                    <Text>{selectedStore.name}</Text>
                    <Grid.Container xs={12} sm={6} gap={2}>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Text>주문 내역</Text>
                            </Grid>
                        </Grid.Container>
                        <Grid>
                            <Text>주문 없음</Text>
                        </Grid>
                    </Grid.Container>
                </Layout>
            </>
        )
    } else if (orders != undefined) {
        return (
            <>
                <Layout>
                    <Text h3>주문 관리</Text>
                    <Text>{selectedStore.name}</Text>
                    <Grid.Container xs={12} sm={6} gap={2}>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Text>주문 내역</Text>
                            </Grid>
                        </Grid.Container>
                        {orders.map((order: OrderItem, index) => (
                            <Grid key={index}>
                                <Text>{format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm:ss')}</Text>
                                {/* TODO: lib에 orderStatus 변환 기능 추가하기 */}
                                <Text>{order.status}</Text>
                                {order.orderDetails.map((orderDetail: OrderDetail & { menu: Menu }, index) => (
                                    <Grid key={index}>
                                        <Text>품목: &nbsp;{orderDetail.menu.name}</Text>
                                        <Text>수량: &nbsp; {orderDetail.amount}</Text>
                                    </Grid>
                                ))}
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
    const selectedStore = response.data

    // 내 모든 매장 정보
    const storesResult = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stores`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const storesRes = await storesResult.json().then((data) => data as StoreAPIGETResponse)
    const storesInfo = storesRes.data

    // storeId 해당 매장 주문들 정보
    const orderResult = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/orders?storeId=${storeId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    // admin 분리 필요?
    const orderRes = await orderResult.json().then((data) => data as OrderAPIGETResponse)
    const orders = orderRes.data

    return {
        props: { selectedStore, storesInfo, orders },
    }
}
