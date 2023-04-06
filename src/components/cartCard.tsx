import { User, Card, Row, Text, Button, Spacer, Link, Tooltip, Checkbox, Col, Grid} from "@nextui-org/react"

import { useRouter } from 'next/router'
import { Dispatch, useState, SetStateAction } from "react"
import { OrderDetail, Prisma } from "@prisma/client"
import { useSession } from "next-auth/react"
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa"

const cartWithMenu = Prisma.validator<Prisma.CartArgs>()({
    include: { 
        menu: { include: { store: true } } 
     }
})

export type CartCardType = Prisma.CartGetPayload<typeof cartWithMenu>

export type CartCardComponentProps = {
    cartCard: CartCardType,
    onChangeCartItem: Dispatch<SetStateAction<CartCardType>>
}

export default ({ cartCard, onChangeCartItem }: CartCardComponentProps) => {
    const router = useRouter()
    const session = useSession()

    const plus = () => {
        cartCard.amount += 1
        onChangeCartItem(cartCard)
    }

    const minus = () => {
        if(cartCard.amount > 1){
            cartCard.amount -= 1
            onChangeCartItem(cartCard)
        }
        else {
            alert("1개 미만으로 변경할 수 없습니다.")
        }
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
                        src={cartCard.menu.image ?? "https://source.unsplash.com/random/600x600/?food"}
                        objectFit="fill"
                        width={150}
                        height={100}
                        alt=""
                    />
                    
                    <Spacer y={0.5} />

                    <Col>
                        <Text size="x-large">{cartCard.menu.name}</Text>
                        <Text h3>{(cartCard.menu.price * cartCard.amount).toLocaleString()} 원</Text>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                <Row justify="flex-end">
                    <Button auto flat onClick={minus} icon={<FaMinus />}></Button>
                    <Text>{cartCard.amount}</Text>
                    <Button auto flat onClick={plus} icon={<FaPlus />}></Button>
                    <Button auto flat color="error" icon={<FaTimes fill="currentColor" />}></Button>
                </Row>
            </Card.Footer>
        </Card>
    )
}
