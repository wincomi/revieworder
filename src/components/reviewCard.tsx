import { User, Card,  Row, Text, Button, Spacer, Link, Tooltip } from "@nextui-org/react"
import { FaHeart, FaShoppingCart, FaStar, FaRegStar } from 'react-icons/fa'

import { useRouter } from 'next/router'
import { useState } from "react"

interface ReviewCardProps {
    // TODO
}

export default (props: ReviewCardProps) => {
    const router = useRouter()
    const [favorite, setFavorite] = useState(0)

    return (
        <Card variant="flat">
            <Card.Header>
                <Row wrap="wrap" justify="space-between" align="center">
                    <User 
                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                        name="이름 없음"
                        size="sm"
                        css={{px: 0}}
                    />
                    <Text css={{ color: "$accents7", fontSize: "$xs" }}>2023. 03. 15{/* review.createTime */}</Text>
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0 }}>
                <Card.Image
                    src="https://source.unsplash.com/random/600x600/?food"
                    objectFit="cover"
                    width="100%"
                    height={300}
                    alt=""
                />
            </Card.Body>
            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                <div style={{ width: '100%'}}>
                    <Row wrap="wrap" justify="space-between" align="center">
                        <Tooltip content={"리뷰 추천하기"} placement="top" color="error">
                            <Button auto flat size="xs" color="error" icon={<FaHeart />} onPress={() => setFavorite(favorite + 1)}>
                                {favorite}
                            </Button>
                        </Tooltip>
                        <Tooltip content={"리뷰어가 선택한 별점"} placement="top" color="warning">
                            <Button auto flat size="xs" color="warning" icon={<><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaStar /><Spacer x={0.1} /><FaRegStar /></>}>(4/5)</Button>
                        </Tooltip>
                    </Row>
                    <Spacer y={0.5} />

                    국회는 국무총리 또는 국무위원의 해임을 대통령에게 건의할 수 있다. 광물 기타 중요한 지하자원·수산자원·수력과 경제상 이용할 수 있는 자연력은 법률이 정하는 바에 의하여 일정한 기간 그 채취·개발 또는 이용을 특허할 수 있다.<br />
                    모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다. 국정감사 및 조사에 관한 절차 기타 필요한 사항은 법률로 정한다. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다.

                    <Text h6 css={{mt: "$4", mb: "$2"}}>주문한 가게</Text>
                    <Tooltip content={"리뷰어가 주문한 가게로 이동하기"} placement="right" color="invert">
                        <Link href={`/store/0`} color="inherit">중국집</Link>
                    </Tooltip>

                    <Text h6 css={{mt: "$4", mb: "$2"}}>주문한 메뉴</Text>
                    <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                        - 짜장면 &times; 1<br />
                        - 짬뽕 &times; 1<br />
                        - 탕수육 &times; 1<br />
                    </Text>
                    <Spacer y={0.5} />
                    
                    <Button css={{width: '100%'}} onPress={() => router.push(`/order`)} flat color="gradient" icon={<FaShoppingCart />}>
                        이 메뉴로 주문하기
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}
