import { User, Card, Row, Text, Button, Spacer, Link, Tooltip, Checkbox, Col, Grid} from "@nextui-org/react"
import { FaHeart, FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa'

import { useRouter } from 'next/router'
import { useState } from "react"
import { OrderDetail, Prisma } from "@prisma/client"
import { useSession } from "next-auth/react"

const cartWithMenu = Prisma.validator<Prisma.CartArgs>()({
    include: { 
        menu: { include: { store: true } } 
     }
})

export type CartCardProps = Prisma.CartGetPayload<typeof cartWithMenu>

export default (cart: CartCardProps) => {
    const router = useRouter()
    const session = useSession()

    return (
        <Card variant="flat">
            <Card.Header>

                <Row justify="flex-end">
                    <Button icon={<></>}>
                    </Button>
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Row align="center">
                    <Spacer y={0.5} />
        
                    <Card.Image
                        src={cart.menu.image ?? "https://source.unsplash.com/random/600x600/?food"}
                        objectFit="fill"
                        width={150}
                        height={100}
                        alt=""
                    />
                    
                    <Spacer y={0.5} />

                    <Col>
                        <Text size="x-large">{cart.menu.name}</Text>
                        {/* TODO: 나중에 money 단위 설정*/}
                        <Text h3>{cart.menu.price * cart.count} 원</Text>
                    </Col>
                </Row>
            </Card.Body>
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                {/*+- 갯수 버튼 만들기*/}
            </Card.Footer>
        </Card>
    )
}
