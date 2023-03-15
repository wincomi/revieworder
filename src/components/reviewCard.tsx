import { User, Card, Grid, Row, Col, Text, Button } from "@nextui-org/react"

export default () => {
    const list = [1, 2, 3, 4, 5] // Sample Data

    return (
        <>
            <Grid.Container gap={2} justify="flex-start">
                {list.map((item, index) => (
                    <Grid xs={12} sm={6} lg={4} key={index}>
                        <Card variant="flat">
                            <Card.Header>
                                <Row wrap="wrap" justify="space-between" align="center">
                                    <User 
                                        src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                        name="이름 없음"
                                        size="sm"
                                        css={{px: 0}}
                                    />
                                    <Text css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>2023. 03. 15{/* review.createTime */}</Text>
                                </Row>
                            </Card.Header>
                            <Card.Body css={{ p: 0 }}>
                                <Card.Image
                                    src="https://via.placeholder.com/600x400"
                                    objectFit="cover"
                                    width="100%"
                                    alt=""
                                />
                            </Card.Body>
                            <Card.Footer css={{ color: "$accents7", fontWeight: "$semibold", fontSize: "$sm" }}>
                                <Row>
                                    <Col>
                                        좋아요: 0{/* favorite */}
                                    </Col>
                                    <Col>
                                        조회수: 0{/* views */}
                                    </Col>
                                </Row>
                            </Card.Footer>
                            <Card.Footer>
                                <div>
                                    <p>국회는 국무총리 또는 국무위원의 해임을 대통령에게 건의할 수 있다. 광물 기타 중요한 지하자원·수산자원·수력과 경제상 이용할 수 있는 자연력은 법률이 정하는 바에 의하여 일정한 기간 그 채취·개발 또는 이용을 특허할 수 있다.</p>
                                    <p>모든 국민은 법률이 정하는 바에 의하여 선거권을 가진다. 국정감사 및 조사에 관한 절차 기타 필요한 사항은 법률로 정한다. 형사피해자는 법률이 정하는 바에 의하여 당해 사건의 재판절차에서 진술할 수 있다.</p>
                                </div>
                            </Card.Footer>
                            <Card.Footer>
                                <Row>
                                    <Col><Button flat color="secondary">가게 바로가기</Button></Col>
                                    <Col><Button flat color="gradient">이 메뉴로 주문하기</Button></Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Grid>
                ))}
            </Grid.Container>
        </>
    )
}
