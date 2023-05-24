import Layout from '@/components/admin/layout'
import { Grid, Progress, Text, Link } from '@nextui-org/react'
import { GetServerSideProps } from 'next/types'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import { OrderAPIGETResponse, OrderItem } from '../api/orders'

interface AdminPageProps {
    storeOrders: OrderItem[]
    storesInfo: StoreInfo[]
}

export default function adminPage({ storeOrders, storesInfo }: AdminPageProps) {
    // 본인 매장 모든 매출 포함
    const totalSales = storeOrders.reduce((totalSales, storeOrder) => {
        const totalPrice = storeOrder.orderDetails.reduce((totalPrice, item) => {
            return totalPrice + item.menu.price * item.amount
        }, 0)
        return totalSales + totalPrice
    }, 0)

    // 매장 별 주문 그룹화
    const storeGroup = storesInfo.map((store) => {
        const orderByStore = storeOrders.filter((order) => order.storeId == store.id)
        return orderByStore
    })

    // 매장 별 매출
    const total = storeGroup.map((orders) => {
        const sales = orders.reduce((sales, order) => {
            const totalPrice = order.orderDetails.reduce((totalPrice, item) => {
                return totalPrice + item.menu.price * item.amount
            }, 0)
            return sales + totalPrice
        }, 0)
        return sales
    })

    // 순서대로 색깔 변경
    const setColor = (index: number) => {
        switch (index % 6) {
            case 0:
                return 'primary'
            case 1:
                return 'secondary'
            case 2:
                return 'success'
            case 3:
                return 'warning'
            case 4:
                return 'error'
            case 5:
                return 'gradient'
        }
    }

    if (storesInfo.length == 0) {
        return (
            <>
                <Layout>
                    <Text>홈</Text>
                    <Link href="/admin">매장 만들기</Link>
                </Layout>
            </>
        )
    }

    return (
        <>
            <Layout>
                <Text h3>홈</Text>
                {/* 홈은 매장 별 매출 보여주고 주문이나 다른데에서 선택바 
                <Text h3>{selectedStore.name ?? '홈'}</Text>
                <StoreSelection stores={storesInfo} />
                */}
                <Grid.Container xs={12} sm={6} gap={2}>
                    <Grid>
                        <Text>통합 총 매출: {totalSales.toLocaleString()}원</Text>
                    </Grid>
                    <Text>매장 별 매출</Text>
                    {storesInfo.map((store: StoreInfo, index) => (
                        <Grid key={index}>
                            <Link color="default" href={`/admin/store?id=${store.id}`}>
                                {store.name}
                            </Link>
                            <Text>매출: {total[index].toLocaleString()} 원</Text>
                            <Progress value={total[index]} max={totalSales} color={setColor(index)} status="primary" />
                        </Grid>
                    ))}
                </Grid.Container>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // 회원이 가지고 있는 매장들 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stores`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as StoreAPIGETResponse)

    const storesInfo = response.data

    // 매장 주문내역들
    const queryString = '?q=' + encodeURIComponent(JSON.stringify(storesInfo))

    const orderResult = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/orders` + queryString, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const orderRes = await orderResult.json().then((data) => data as OrderAPIGETResponse)
    const storeOrders = orderRes.data

    return {
        props: { storeOrders, storesInfo },
    }
}
