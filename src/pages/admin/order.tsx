import Layout from '@/components/admin/layout'
import { GetServerSideProps } from 'next'
import { StoreAPIGETResponse, StoreInfo } from '../api/stores'
import { OrderAPIGETResponse, OrderItem } from '../api/orders'
import Link from 'next/link'
import { Dropdown, Grid, Text } from '@nextui-org/react'
import StoreSelection from '@/components/admin/storeSelection'
import { format } from 'date-fns'
import { Menu, OrderDetail, OrderStatus } from '@prisma/client'
import { Key, SetStateAction, useEffect, useState } from 'react'
import orderStatusFormat from '@/utils/orderStatusFormat'

interface adminOrderPageProps {
    storeInfo: StoreInfo | StoreInfo[]
    orders: OrderItem[]
}

export default ({ storeInfo, orders }: adminOrderPageProps) => {
    const [orderItems, setOrderItems] = useState(orders)

    const setOrderItem = (data: SetStateAction<OrderItem | null>, index: number) => {
        if (data == null) {
            // data가 null이면 index를 삭제함
            const updateOrder = orderItems.slice(index, 1)

            setOrderItems(Object.assign(updateOrder))
        } else {
            const updateOrder = orderItems.map((item, idx) => {
                if (idx === index) {
                    return data
                } else return item
            })

            setOrderItems(Object.assign(updateOrder))
        }
    }

    const setStatus = (index: number, status: string) => {
        switch (status) {
            case 'REQUESTED':
                return [index + 'COMPLETED']
            case 'CONFIRMED':
                return [index + 'CONFIRMED']
            case 'COMPLETED':
                return [index + 'CONFIRMED,', index + 'CANCELED']
            case 'CANCELED':
                return [index + 'CONFIRMED', index + 'COMPLETED']
        }
    }

    const dropdownAction: (key: Key) => void = (key) => {
        // index 랑 status(원래 key) 분리
        const index = key.toString().slice(0, 1)
        const status = key.toString().slice(1)

        setOrderItem({ ...orderItems[Number(index)], status: status as OrderStatus }, Number(index))
    }

    // 값(amount) 변경 시 자동 업데이트
    useEffect(() => {
        const result = async () => {
            await fetch(`/api/admin/orders`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    orders: orderItems,
                }),
            })
        }

        result()
    }, [orderItems])

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
    } else if (orders == undefined) {
        return (
            <>
                <Layout>
                    <Text h3>주문 관리</Text>
                    <Text>{storeInfo.name}</Text>
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
                    <Text>{storeInfo.name}</Text>
                    <Grid.Container xs={12} sm={6} gap={2}>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Text>주문 내역</Text>
                            </Grid>
                        </Grid.Container>
                        {orderItems.map((order: OrderItem, index: number) => (
                            <Grid key={index}>
                                <Text>{format(new Date(order.orderDate), 'yyyy-MM-dd HH:mm:ss')}</Text>
                                {/* 주문 상태 변경 */}
                                <Dropdown>
                                    <Dropdown.Button flat color="secondary">
                                        {orderStatusFormat(order.status)}
                                    </Dropdown.Button>
                                    <Dropdown.Menu
                                        aria-label="Actions"
                                        onAction={dropdownAction}
                                        disabledKeys={setStatus(index, order.status)}
                                    >
                                        <Dropdown.Item key={index + 'CONFIRMED'}>주문 확인</Dropdown.Item>
                                        <Dropdown.Item key={index + 'COMPLETED'}>주문 완료</Dropdown.Item>
                                        <Dropdown.Item key={index + 'CANCELED'}>주문 취소</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stores?id=${storeId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as StoreAPIGETResponse)
    const storeInfo = response.data

    // storeId 해당 매장 주문들 정보
    const orderResult = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/orders?storeId=${storeId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })

    const orderRes = await orderResult.json().then((data) => data as OrderAPIGETResponse)
    const orders = orderRes.data

    return {
        props: { storeInfo, orders },
    }
}
