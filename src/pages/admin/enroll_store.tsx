import Head from 'next/head'
import Layout from '@/components/layout'
import { Button, Input, Spacer, Text, Textarea } from '@nextui-org/react'
import { Prisma } from '@prisma/client'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { UserAPIGETResponse } from '../api/user'

interface StoreEnrollPageProps {
    /// 매장 등록 할 고객 정보
    user: Prisma.UserCreateNestedOneWithoutStoresInput
}

export default function storeEnroll({ user }: StoreEnrollPageProps) {
    if (user == undefined) {
        return (
            <>
                <Head>
                    <title>매장 등록</title>
                </Head>
                <Layout>
                    <Text>유저 정보를 확인 할 수 없습니다.</Text>
                </Layout>
            </>
        )
    } else if (user != undefined) {
        const [storeInfo, setStoreInfo] = useState<Prisma.StoreCreateInput>({
            name: '',
            description: '',
            address: '',
            image: '',
            phoneNumber: '010-0000-0000',
            user: user,
        })

        const create = async () => {
            const result = await fetch(`/api/admin/stores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    inputStore: storeInfo,
                }),
            })

            if (result.status == 200) {
                alert('매장 등록 완료.')
            } else {
                alert('매장 등록 실패.')
            }
        }

        // 자동 하이픈 처리
        const autoHyphen = (e: { currentTarget: { value: string } }) => {
            e.currentTarget.value = e.currentTarget.value
                .replace(/[^0-9]/g, '')
                .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
                .replace(/(\-{1,2})$/g, '')

            setStoreInfo({ ...storeInfo, phoneNumber: e.currentTarget.value })
        }

        return (
            <>
                <Head>
                    <title>매장 등록</title>
                </Head>
                <Layout>
                    <form>
                        <fieldset style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                            <Input
                                type="text"
                                name="name"
                                label="매장 이름"
                                placeholder=""
                                shadow={false}
                                fullWidth={true}
                                helperText="매장 이름을 입력하세요."
                                onChange={(e) => setStoreInfo({ ...storeInfo, name: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="image"
                                label="이미지"
                                placeholder=""
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setStoreInfo({ ...storeInfo, image: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="address"
                                label="주소"
                                placeholder="address"
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setStoreInfo({ ...storeInfo, address: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="tel"
                                label="휴대폰 번호"
                                placeholder="010-0000-0000"
                                shadow={false}
                                fullWidth={true}
                                // onChange에 이벤트 2개를 동시에 못해서 autoHyphen에서 value값 저장
                                onChange={autoHyphen}
                            />
                            <Spacer y={2} />
                            <Textarea
                                rows={5}
                                label="매장 설명"
                                placeholder="#매장#설명"
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setStoreInfo({ ...storeInfo, description: e.currentTarget.value })}
                            />
                            <Button onPress={create}>매장 등록</Button>
                        </fieldset>
                    </form>
                </Layout>
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    // 매장 등록 할 유저 정보
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

        return {
            props: {
                user,
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
