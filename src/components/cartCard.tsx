import { Card, Row, Text, Button, Spacer, Col } from "@nextui-org/react"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"

import { Dispatch, SetStateAction } from "react"
import { CartItem } from "@/pages/api/carts"
import router from "next/router"

export type CartCardProps = {
    cartItem: CartItem,
    onChangeCartItem: Dispatch<SetStateAction<CartItem>>
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
        } else {
            alert("1개 미만으로 변경할 수 없습니다.")
        }
    }

    const del = async() => {
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
        // refresh 필요
    }

    return (
        <Card variant="flat" css={{width: '100%'}}>
            <Card.Header>
                <Row justify="flex-end">
                    
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Row align="center">
                    <Spacer y={0.5} />
        
                    <Card.Image
                        src={cartItem.menu.image ?? "https://source.unsplash.com/random/600x600/?food"}
                        objectFit="fill"
                        width={150}
                        height={100}
                        alt=""
                    />
                    
                    <Spacer y={0.5} />

                    <Col>
                        <Text size="x-large">{cartItem.menu.name}</Text>
                        <Text h3>{(cartItem.menu.price * cartItem.amount).toLocaleString()} 원</Text>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                <Row justify="flex-end">
                    <Button auto flat onClick={minus} icon={<FaMinus />}></Button>
                    <Text>{cartItem.amount}</Text>
                    <Button auto flat onClick={plus} icon={<FaPlus />}></Button>
                    <Button auto flat onClick={del} color="error" icon={<FaTimes fill="currentColor" />}></Button>
                </Row>
            </Card.Footer>
        </Card>
    )
}
