import { Card, Row, Text, Button, Spacer, Col, Grid } from "@nextui-org/react"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"

import { Dispatch, SetStateAction } from "react"
import { CartItem } from "@/pages/api/carts"

export type CartCardProps = {
    cartItem: CartItem,
    onChangeCartItem: Dispatch<SetStateAction<CartItem | null>>
}

export default ({ cartItem, onChangeCartItem }: CartCardProps) => {
    const plus = () => {
        cartItem.amount += 1
        onChangeCartItem(cartItem)
    }

    const minus = () => {
        if (cartItem.amount > 1) {
            cartItem.amount -= 1
            onChangeCartItem(cartItem)
        }
    }

    const del = async () => {
        if (confirm('장바구니에서 삭제하시겠습니까?')) {
            const result = await fetch(`api/carts/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    cart: cartItem
                })
            })
            
            // 새로고침
            onChangeCartItem(null)
        }
    }

    return (
        <Card variant="flat" css={{ width: '100%' }}>
            <Card.Body>
                <Grid.Container>
                    <Grid>
                        <Card.Image
                            src={cartItem.menu.image ?? "http://via.placeholder.com/128x128"}
                            objectFit="fill"
                            width={128}
                            height={128}
                            alt=""
                        />
                    </Grid>
                    <Spacer />
                    <Grid css={{ flexGrow: 1 }}>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Text size="x-large">{cartItem.menu.name}</Text>
                            </Grid>
                            <Grid>
                                <Button light auto onPress={del} color="error" icon={<FaTimes fill="currentColor" />}></Button>
                            </Grid>
                        </Grid.Container>
                        <Grid.Container justify="space-between" alignItems="center">
                            <Grid>
                                <Button.Group flat auto>
                                    <Button onPress={minus} icon={<FaMinus />} disabled={cartItem.amount == 1}></Button>
                                    <Button disabled={true} css={{ minWidth: '64px' }}>{cartItem.amount}</Button>
                                    <Button onPress={plus} icon={<FaPlus />}></Button>
                                </Button.Group>
                            </Grid>
                            <Grid>
                                <Text h3>{(cartItem.menu.price * cartItem.amount).toLocaleString()} 원</Text>
                            </Grid>
                        </Grid.Container>
                    </Grid>
                </Grid.Container>
            </Card.Body>
        </Card>
    )
}
