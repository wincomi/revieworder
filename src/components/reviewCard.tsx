import { User, Card, Row, Text, Button, Spacer, Link, Tooltip } from "@nextui-org/react"
import { FaHeart, FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa'

import { useRouter } from 'next/router'
import { useState } from "react"
import { Prisma } from "@prisma/client"

// review에 연결된 order에서 store, user, orderDetail을 다시 orderDetail에서 menu정보를 불러온다
// 결론: review에 연결된 모든 테이블 조회 가능
// + 나중에 타입들 모아서 라이브러리화 생각 중.
const reviewWithOrder = Prisma.validator<Prisma.ReviewArgs>()({
    include: { 
        order: {
            include: {
                store: true,
                user: true,
                orderDetail: {
                    include: { menu: true }
                }
            }
        }
     }
})

export type ReviewCardProps = Prisma.ReviewGetPayload<typeof reviewWithOrder>

export default (review: ReviewCardProps) => {
    const router = useRouter()
    const [favorite, setFavorite] = useState(review.favorite)

    return (
        <Card variant="flat">
            <Card.Header>
                <Row wrap="wrap" justify="space-between" align="center">
                    <User
                        src={review.order.user.image ?? "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
                        name={review.order.user.name ?? "이름 없음"}
                        size="sm"
                        css={{ px: 0 }}
                    />
                    <Text css={{ color: "$accents7", fontSize: "$xs" }}>
                        {/* TODO: Text content does not match server-rendered HTML 해결 후 dateFormat() 적용 */}
                        {String(review.createTime)}
                    </Text>
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Card.Image
                    src={review.image ?? "https://source.unsplash.com/random/600x600/?food"}
                    objectFit="cover"
                    width="100%"
                    height={300}
                    alt=""
                />
            </Card.Body>
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                <div style={{ width: '100%' }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                        <Tooltip content={"리뷰 추천하기"} placement="top" color="error">
                            <Button auto flat size="xs" color="error" icon={<FaHeart />} onPress={() => setFavorite(favorite + 1)}>
                                {favorite}
                            </Button>
                        </Tooltip>
                        <Tooltip content={"리뷰어가 선택한 별점"} placement="top" color="warning">
                            <Button auto flat size="xs" color="warning" icon={<><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaRegStar /></>}>({review.rating}/5)</Button>
                        </Tooltip>
                    </Row>
                    <Spacer y={0.5} />

                    {review.content}

                    <Text h6 css={{ mt: "$4", mb: "$2" }}>주문한 가게</Text>
                    <Tooltip content={"리뷰어가 주문한 가게로 이동하기"} placement="right" color="invert">
                        <Link href={`/store/0`} color="inherit">{review.order.store.name}</Link>
                    </Tooltip>
                    <Spacer y={0.5} />
                    <Text h6 css={{ mt: "$4", mb: "$2" }}>주문한 메뉴</Text>
                    
                    {(review.order.orderDetail)?.map((item) => (
                        <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                            - {item.menu.name} &times; {item.count}<br />
                        </Text>
                    ))}
                    <Spacer y={0.5} />

                    <Button css={{ width: '100%' }} onPress={() => router.push(`/cart`)} color="gradient" icon={<FaShoppingCart />}>
                        이 메뉴로 주문하기
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}
