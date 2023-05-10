import Layout from '@/components/layout'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]'
import { format, formatDistance } from 'date-fns'
import { ko } from 'date-fns/locale'
import { GetServerSideProps } from 'next/types'
import { getUserAccount, getInstaFeedbyAccount } from '@/libs/sns'
import { User, Modal, Card, Grid, Row, Text, Button, Input, Tooltip, Textarea } from '@nextui-org/react'
import { ReviewItem } from '@/pages/api/reviews'

export type ReviewCardProps = {
    review: ReviewItem
    onChangeQuery: Dispatch<SetStateAction<string>>
}
//export default function postinsta({feed}:any, {insta}:Account, {facebook}:Account) {
export default function postinsta({ feed }: any) {
    if (feed == null) {
        return (
            <Layout>
                <Text h3>로그인 후 접속해주세요</Text>
            </Layout>
        )
    }
    if (feed != null) {
        const [visible, setVisible] = useState(false)
        const reviewHandler = () => setVisible(true)
        const reviewCloser = () => {
            setVisible(false)
        }
        let caption = ''

        console.log(feed)
        const images = feed.data
        return (
            <Layout>
                {`instagram feed 부분임`}
                <Grid.Container gap={2} alignItems="stretch" css={{ px: 0 }}>
                    {images &&
                        images.map((image: any) => (
                            <Grid xs={12} sm={6} lg={4} key={image.id}>
                                <Card variant="flat">
                                    <Card.Header>
                                        <Row wrap="wrap" justify="space-between" align="center">
                                            <User name={image.username ?? ''} size="sm" css={{ px: 0 }} />
                                            <Tooltip
                                                content={format(new Date(image.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                                                placement="left"
                                                color="invert"
                                            >
                                                <Text css={{ color: '$accents7', fontSize: '$xs' }}>
                                                    {formatDistance(new Date(image.timestamp), new Date(), {
                                                        addSuffix: true,
                                                        locale: ko,
                                                    })}
                                                </Text>
                                            </Tooltip>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body css={{ p: 0, flexGrow: 'unset' }}>
                                        <Card.Image
                                            src={image.media_url ?? 'http://via.placeholder.com/640x480'}
                                            objectFit="cover"
                                            width="100%"
                                            height={300}
                                            alt={image.caption ?? ''}
                                            showSkeleton
                                        />
                                    </Card.Body>
                                </Card>
                            </Grid>
                        ))}
                </Grid.Container>
                {`리뷰 작성 부분임`}
                <Button auto onPress={reviewHandler}>
                    리뷰 작성
                </Button>
                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    open={visible}
                    onClose={reviewCloser}
                    width="600px"
                >
                    <Modal.Header>
                        <Text id="modal-title" size={18}>
                            리뷰 Modal
                        </Text>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid.Container gap={2} justify="center">
                            <Grid xs={8}>
                                <Input id="modal-description" bordered labelPlaceholder="제목" color="primary" />
                            </Grid>
                            <Grid xs={8}>
                                <Textarea placeholder="내용" id="modal-description" />
                            </Grid>
                            <Grid xs={8}>
                                <Input id="modal-description" bordered labelPlaceholder="해시태그" color="secondary" />
                            </Grid>
                        </Grid.Container>
                    </Modal.Body>
                    <Modal.Footer>
                        {`instagram post 연동`}
                        {`facebook post 연동`}
                        <Button
                            flat
                            auto
                            color="error"
                            onPress={() => {
                                setVisible(false)
                            }}
                        >
                            작성 취소
                        </Button>
                        <Button
                            onPress={() => {
                                setVisible(false)
                            }}
                        >
                            게시
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session) {
        // session 에러 처리
        return {
            // 추후 return null 없애버리고 redirect to login page로 처리
            props: {
                feed: null,
            },
        }
    }
    let userId = session?.user.id
    // user의 instagram account 를 받아옴
    const insta = await getUserAccount(userId, 'instagram')
    if (!insta) {
        const facebook = await getUserAccount(userId, 'facebook')
        if (!facebook) {
            return {
                props: {
                    instaAccount: null,
                    facebookAccount: null,
                    feed: null,
                },
            }
        }
        return {
            props: {
                instaAccount: null,
                facebookAccount: facebook,
                feed: null,
            },
        }
    }
    // 현재 facebook과 instagram의 user.id가 개인마다 여러개라서 해당 쿼리는 불가능
    // DB에 개인 user 묶음을 추가하면 한번에 여러곳의 sns에 연동이 가능하다
    // 근데 OAuth DB 건드리는거라 가능할진 몰?루
    // const facebook = await getFacebookUser(userId)
    // if(!facebook){
    //     return{
    //         props:{
    //             instaAccount: insta,
    //             facebookAccount: null,
    //             feed: null
    //         }
    //     }
    // }
    // 피드 받아옴
    const feed = await getInstaFeedbyAccount(insta)
    return {
        props: {
            instaAccount: insta,
            //facebookAccount: facebook,
            feed: feed,
        },
    }
}
