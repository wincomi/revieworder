import { Card, Grid, Row, Text, Spacer, Button } from "@nextui-org/react"
import { CartItem } from "@/pages/api/carts"
import { useState } from "react"
import { FaRegCreditCard } from "react-icons/fa"

export type SummaryCardProps = {
    cartItems: CartItem[],
    onPressOrderButton: (() => void)
}

export default ({ cartItems, onPressOrderButton }: SummaryCardProps) => {
    const totalPrice = cartItems.reduce((totalPrice, item) => {
        return totalPrice + item.menu.price * item.amount
    }, 0)

    return (
        <Card variant="flat">
            <Card.Header>
                <Text h3 css={{ mb: 0 }}>결제 정보</Text>
            </Card.Header>
            <Card.Divider />
            <Card.Body css={{ p: 0 }}>
                <Grid justify="center">
                    {cartItems.map((cartItem: CartItem, index: number) => (
                        <div key={cartItem.id}>
                            <Row justify="space-between">
                                <Text>- {cartItem.menu.name} x {cartItem.amount}</Text>
                                <Text>{(cartItem.menu.price * cartItem.amount).toLocaleString()}원</Text>
                            </Row>
                            <Spacer y={0.2} />
                        </div>
                    ))}
                </Grid>
            </Card.Body>
            <Card.Divider />
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                <div style={{ width: '100%' }}>
                    <Grid.Container justify="space-between" alignItems="center">
                        <Grid>
                            <Text h3>총 결제금액</Text>
                        </Grid>
                        <Grid>
                            <Text h2 style={{ textAlign: 'right' }}>
                                {totalPrice.toLocaleString()}원
                            </Text>
                        </Grid>
                    </Grid.Container>
                    <Button
                        color="gradient"
                        css={{ width: '100%' }}
                        icon={<FaRegCreditCard />}
                        onPress={async () => await onPressOrderButton()}>
                        주문하기
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}