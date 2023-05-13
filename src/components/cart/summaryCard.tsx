import { Card, Grid, Row, Text, Spacer, Button, Modal } from '@nextui-org/react'
import { CartItem } from '@/pages/api/carts'
import { FaRegCreditCard } from 'react-icons/fa'
import React from 'react'
import router from 'next/router'
import { tossPayment } from '@/libs/tossPay'

export type SummaryCardProps = {
    cartItems: CartItem[]

    /// TOSS_CLIENT_KEY
    tossClientKey: string

    /// NEXTAUTH_URL
    tossRedirectURL: string
}

export default ({ cartItems, tossClientKey, tossRedirectURL }: SummaryCardProps) => {
    const totalPrice = cartItems.reduce((totalPrice, item) => {
        return totalPrice + item.menu.price * item.amount
    }, 0)

    // 결제 방법 선택 창
    const [visible, setVisible] = React.useState(false)
    const handler = () => setVisible(true)
    const closeHandler = () => {
        setVisible(false)
        console.log('closed')
    }

    // 충전
    const charge = async () => {
        // // clientKey, 충전 금액, redirect host url, 주문번호, 표시 내용, 유저 정보
        // tossPayment(tossClientKey, point, tossRedirectURL, undefined, undefined, user)
        tossPayment(tossClientKey, totalPrice, tossRedirectURL, undefined, '리뷰오더 결제', cartItems[0].user)
    }

    // 주문 기능
    const onPressOrderButton = async (payMethod: string) => {
        if (payMethod == 'point') {
            if (cartItems[0].user.money - totalPrice > 0) {
                await fetch(`api/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // session의 쿠키를 보내는데 req가 없으면 필요
                    credentials: 'include',

                    body: JSON.stringify({
                        carts: cartItems,
                        money: totalPrice,
                    }),
                })
                await fetch(`api/user/moneyapi`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // session의 쿠키 전달
                    credentials: 'include',
                    body: JSON.stringify({
                        userId: cartItems[0].userId,
                        money: totalPrice,
                        opt: 'pay',
                    }),
                })
                router.push('/order')
            }
            // 포인트 없으면 profile로 이동
            else {
                alert('포인트 충전 필요')
                router.push('/profile')
            }
        }
    }

    return (
        <Card variant="flat">
            <Card.Header>
                <Text h3 css={{ mb: 0 }}>
                    결제 정보
                </Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ p: 0 }}>
                <Grid justify="center">
                    {cartItems.map((cartItem: CartItem) => (
                        <div key={cartItem.id}>
                            <Row justify="space-between">
                                <Text>
                                    - {cartItem.menu.name} x {cartItem.amount}
                                </Text>
                                <Text>{(cartItem.menu.price * cartItem.amount).toLocaleString()}원</Text>
                            </Row>
                            <Spacer y={0.2} />
                        </div>
                    ))}
                </Grid>
            </Card.Body>
            <Card.Divider />
            <Card.Footer css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                <div style={{ width: '100%' }}>
                    <Grid.Container justify="space-between" alignItems="center">
                        <Grid>
                            <Text h3> 총 결제금액 </Text>
                        </Grid>
                        <Grid>
                            <Text h2 style={{ textAlign: 'right' }}>
                                {totalPrice.toLocaleString()}원
                            </Text>
                        </Grid>
                    </Grid.Container>
                    <Button color="gradient" css={{ width: '100%' }} icon={<FaRegCreditCard />} onPress={handler}>
                        주문하기
                    </Button>
                    <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
                        <Modal.Header>
                            <Text id="modal-title" size={18}>
                                결제 방법 선택
                            </Text>
                        </Modal.Header>
                        <Modal.Body>
                            <Text> 총 결제 금액: {totalPrice.toLocaleString()}원 </Text>
                            <Text> 잔여 포인트: {cartItems[0].user.money.toLocaleString()} RP </Text>
                            <Text> 결제 후 포인트: {(cartItems[0].user.money - totalPrice).toLocaleString()} RP</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button auto onPress={closeHandler} onClick={charge}>
                                바로 결제
                            </Button>
                            <Button auto onPress={closeHandler} onClick={() => onPressOrderButton('point')}>
                                포인트 결제
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Card.Footer>
        </Card>
    )
}
