import Head from 'next/head'
import { Button, Text, Spacer, Input, Card, Loading, Textarea, Modal } from '@nextui-org/react'
import Layout from '@/components/layout'
import { TbPigMoney } from 'react-icons/tb'
import { FaPencilAlt } from 'react-icons/fa'

import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { getAccountProviders } from '@/libs/users'
import { UserAPIGETResponse, UserInfo } from '../api/user'
import React from 'react'

import { tossPayment } from '@/libs/tossPay'
import router from 'next/router'

interface ProfileEditPageProps {
    /// 현재 세션의 유저 정보
    user: UserInfo

    /// 연결된 SNS 계정 종류
    accountProviders: string[]

    /// TOSS_CLIENT_KEY
    tossClientKey: string

    /// NEXTAUTH_URL
    tossRedirectURL: string
}

export default function profileEdit({ user, accountProviders, tossClientKey, tossRedirectURL }: ProfileEditPageProps) {
    // input default 값들
    const [placeholder] = useState({
        name: '이름을 입력하세요.',
        email: 'example@naver.com',
        tel: '010-0000-0000',
        allergy: '알러지 사항을 입력하세요. 주문시 가게로 전달됩니다.',
    })

    // 저장 중
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [mutableUser, setMutableUser] = useState(user)

    // 회원정보 수정
    const edit = async () => {
        setIsLoadingUpdate(true)

        const result = await fetch(`/api/user/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                user: mutableUser,
            }),
        })

        if (result.status == 200) {
            alert('저장되었습니다.')
        } else {
            alert('프로필을 저장할 수 없습니다.')
        }

        setIsLoadingUpdate(false)
    }

    // 충전
    const charge = async () => {
        closeHandler()
        setIsLoadingUpdate(true)
        // clientKey, 충전 금액, redirect host url, 결제 방식 여부 ,주문번호, 표시 내용, 유저 정보
        tossPayment(tossClientKey, point, tossRedirectURL, false, undefined, '리뷰오더 포인트 충전', user)

        setIsLoadingUpdate(false)
    }

    // 자동 하이픈 처리
    const autoHyphen = (e: { currentTarget: { value: string } }) => {
        e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
            .replace(/(\-{1,2})$/g, '')

        // 전화번호 value 값 저장 -- 124 주석 참고
        // 나중에 hyPhen 처리 수정 필요 !! (01056490485를 -삽입 및 제거 필요 - 현재는 타이핑때만 작동)
        setMutableUser({ ...mutableUser, phoneNumber: e.currentTarget.value })
    }

    // 충전 창
    const [point, setPoint] = useState(0)
    const [visible, setVisible] = React.useState(false)
    const handler = () => setVisible(true)
    const closeHandler = () => {
        setVisible(false)
        console.log('closed')
    }

    return (
        <>
            <Head>
                <title>내 프로필</title>
            </Head>
            <Layout>
                <Text h1>내 프로필</Text>
                {accountProviders.length > 0 && (
                    <Card css={{ mb: '$12', $$cardColor: '$colors$gradient' }}>
                        <Card.Body>
                            <Text b color="white">
                                현재 계정이 {accountProviders[0].toLocaleUpperCase()}(으)로 연결되어있습니다.
                            </Text>
                        </Card.Body>
                    </Card>
                )}

                <Card variant="flat">
                    <Card.Body>
                        <Text b>리뷰오더 머니</Text>
                        <Text h3 css={{ mb: 0 }}>
                            {mutableUser.money.toLocaleString()} 원
                        </Text>
                        <Button
                            flat
                            auto
                            color="warning"
                            size="sm"
                            css={{ mt: 8, ml: 'auto' }}
                            icon={<TbPigMoney />}
                            onPress={handler}
                        >
                            충전
                        </Button>
                        <Modal closeButton blur aria-labelledby="modal-title" open={visible} onClose={closeHandler}>
                            <Modal.Header>
                                <Text id="modal-title" size={18}>
                                    포인트 충전
                                </Text>
                            </Modal.Header>
                            <Modal.Body>
                                <Input
                                    clearable
                                    bordered
                                    fullWidth
                                    color="primary"
                                    size="lg"
                                    placeholder={String(point)}
                                    onChange={(e) => setPoint(Number(e.currentTarget.value))}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button auto onPress={charge}>
                                    충전
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Card.Body>
                </Card>

                <Spacer />

                <form>
                    <fieldset disabled={isLoadingUpdate} style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                        <Input
                            type="text"
                            name="name"
                            label="이름"
                            placeholder={placeholder.name}
                            initialValue={mutableUser.name ?? undefined}
                            shadow={false}
                            fullWidth={true}
                            helperText="주문 혹은 리뷰 작성시 나타나는 이름을 입력하세요."
                            onChange={(e) => setMutableUser({ ...mutableUser, name: e.currentTarget.value })}
                        />
                        <Spacer y={2} />
                        <Input
                            type="email"
                            label="이메일"
                            placeholder={placeholder.email}
                            initialValue={mutableUser.email ?? undefined}
                            shadow={false}
                            fullWidth={true}
                            onChange={(e) => setMutableUser({ ...mutableUser, email: e.currentTarget.value })}
                        />
                        <Spacer y={2} />
                        <Input
                            type="tel"
                            label="휴대폰 번호"
                            placeholder={placeholder.tel}
                            initialValue={mutableUser.phoneNumber ?? undefined}
                            shadow={false}
                            fullWidth={true}
                            // onChange에 이벤트 2개를 동시에 못해서 autoHyphen에서 value값 저장
                            onChange={autoHyphen}
                        />
                        <Spacer y={2} />
                        <Textarea
                            // 초기 TextArea 크기 ex) 5줄
                            rows={5}
                            label="전달 사항"
                            placeholder={placeholder.allergy}
                            initialValue={mutableUser.allergy ?? undefined}
                            shadow={false}
                            fullWidth={true}
                            onChange={(e) => setMutableUser({ ...mutableUser, allergy: e.currentTarget.value })}
                        />

                        <Spacer y={2} />

                        <Button
                            flat
                            css={{ ml: 'auto' }}
                            icon={!isLoadingUpdate && <FaPencilAlt />}
                            disabled={isLoadingUpdate}
                            onPress={() => edit()}
                        >
                            {isLoadingUpdate ? (
                                <Loading type="points-opacity" color="currentColor" size="sm" />
                            ) : (
                                <>저장</>
                            )}
                        </Button>
                    </fieldset>
                </form>
                {user.stores[0] != undefined || user.stores != null ? (
                    <Button onPress={() => router.push('/admin')}> 내 매장 관리 </Button>
                ) : (
                    <Button onPress={() => router.push('/admin')}> 매장 만들기 </Button>
                )}
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/user/`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || '',
        },
    })

    try {
        const response = await result.json().then((data) => data as UserAPIGETResponse) // any to User
        const user = response.data
        const accountProviders = await getAccountProviders(user.id)

        return {
            props: {
                user: user,
                accountProviders: accountProviders,
                tossClientKey: process.env.TOSS_CLIENT_KEY,
                tossRedirectURL: process.env.NEXTAUTH_URL,
            },
        }
    } catch {
        // JSON 파싱 실패시 리다이렉트
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        }
    }
}
