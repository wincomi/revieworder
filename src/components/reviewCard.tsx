import { useRouter } from 'next/router'
import { ReactNode, useState } from "react"
import { Prisma } from "@prisma/client"
import { useSession } from "next-auth/react"
import { format, formatDistance } from 'date-fns'
import { ko } from 'date-fns/locale'

import { User, Card, Row, Text, Button, Spacer, Link, Tooltip, Loading } from "@nextui-org/react"
import { FaHeart, FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa'

// review에 연결된 order에서 store, user, orderDetail을 다시 orderDetail에서 menu정보를 불러온다
// 결론: review에 연결된 모든 테이블 조회 가능
// + 나중에 타입들 모아서 라이브러리화 생각 중.
const reviewWithOrder = Prisma.validator<Prisma.ReviewArgs>()({
    include: { 
        order: {
            include: {
                store: true,
                user: true,
                orderDetails: {
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
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const addToCart = async () => {
        setIsAddingToCart(true)

        const result = await fetch(`api/carts`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                order_details: review.order.orderDetails
            })
        })

        setIsAddingToCart(false)

        if (confirm('장바구니로 이동하시겠습니까?')) {
            router.push('/cart')
        }
    }

    // Components
    const CardFooterTitle = ({ children }: { children: ReactNode }) => {
        return <Text h6 css={{ mt: "$4", mb: "$2" }}>{children}</Text>
    }

    const RatingIcon = (rating: number) => {
        return <>
            {[...Array(rating)].map(() => {
                return <><FaStar /><Spacer x={0.1} /></>
            })}
            {[...Array(5 - rating)].map(() => {
                return <><FaRegStar /><Spacer x={0.1} /></>
            })}
        </>
    }

    const createTimeText = new Date(review.createTime).toLocaleString()

    return (
        <Card variant="flat">
            {/* 유저 정보 및 리뷰 작성 시간 */}
            <Card.Header>
                <Row wrap="wrap" justify="space-between" align="center">
                    <User
                        src={review.order.user.image ?? "http://via.placeholder.com/64x64"}
                        name={review.order.user.name ?? "이름 없음"}
                        size="sm"
                        css={{ px: 0 }}
                    />
                    <Tooltip content={format(new Date(review.createTime), 'yyyy-MM-dd HH:mm:ss')} placement="left" color="invert">
                        <Text css={{ color: "$accents7", fontSize: "$xs" }}>
                            {formatDistance(new Date(review.createTime), new Date(), { addSuffix: true, locale: ko })}
                        </Text>
                    </Tooltip>
                </Row>
            </Card.Header>
            {/* 리뷰 사진 */}
            <Card.Body css={{ p: 0, flexGrow: 'unset' }}>
                <Card.Image
                    src={review.image ?? "http://via.placeholder.com/640x480"}
                    objectFit="cover"
                    width="100%"
                    height={300}
                    alt="리뷰 사진"
                    showSkeleton
                />
            </Card.Body>
            {/* 리뷰 추천, 별점 등 리뷰 정보 */}
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                {/* TODO: 세로 정렬 */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Row wrap="wrap" justify="space-between" align="center">
                        <Tooltip content={"리뷰 추천하기"} placement="top" color="error">
                            <Button auto flat size="xs" color="error" icon={<FaHeart />} onPress={() => setFavorite(favorite + 1)}>
                                {favorite}
                            </Button>
                        </Tooltip>
                        <Tooltip content={"리뷰어가 선택한 별점"} placement="top" color="warning">
                            <Button auto flat size="xs" color="warning" icon={RatingIcon(review.rating)}>
                                ({review.rating}/5)
                            </Button>
                        </Tooltip>
                    </Row>
                    <Spacer y={0.5} />

                    <div style={{ alignSelf: 'stretch' }}>
                        {review.content.split(" ").map((str) => {
                            if (str.startsWith("#")) {
                                return <><Link href="#">{str}</Link> </>
                            }
                            return str + " "
                        })}
                    </div>

                    <CardFooterTitle>주문한 가게</CardFooterTitle>
                    <Tooltip content={"리뷰어가 주문한 가게로 이동하기"} placement="right" color="invert">
                        <Link href={`/store/0`} color="inherit">{review.order.store.name}</Link>
                    </Tooltip>
                    <Spacer y={0.5} />

                    <CardFooterTitle>주문한 메뉴</CardFooterTitle>
                    {review.order.orderDetails?.map((orderDetail) => (
                        <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                            - {orderDetail.menu.name} &times; {orderDetail.amount}<br />
                        </Text>
                    ))}
                    <Spacer y={0.5} />

                    <Button 
                        css={{ width: '100%' }} 
                        color="gradient" 
                        icon={<FaShoppingCart />}
                        onPress={ async () => await addToCart() }
                        disabled={isAddingToCart}
                    >
                        {isAddingToCart ? <Loading type="points" color="currentColor" size="sm" /> : <>장바구니에 담기</>}
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}
