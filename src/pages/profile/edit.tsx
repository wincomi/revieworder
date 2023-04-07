import Head from 'next/head'
import { Button, Text, Spacer, Input, Card, Loading, Textarea } from "@nextui-org/react"
import Layout from '@/components/layout'
import { TbPigMoney } from 'react-icons/tb'

import { GetServerSideProps } from 'next'
import { getAccountProviders } from '@/libs/users'
import { FaPencilAlt } from 'react-icons/fa'
import { useState } from 'react'
import { UserAPIGETResponse, UserInfo } from '../api/users'

interface ProfileEditPageProps {
    /// 현재 세션의 유저 정보
    user: UserInfo,

    /// 연결된 SNS 계정 종류
    accountProviders: string[]
}

export default function profileEdit ({ user, accountProviders }: ProfileEditPageProps) {

    // input default 값들
    const [placeholder, setPlaceHolder] = useState({
        name: "이름을 입력하세요.",
        email: "example@naver.com",
        tel: "010-0000-0000",
        allergy: "알러지 사항을 입력하세요. 가게 측으로 전달됩니다."
    })

    // 저장 중
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [userInfo, setUserInfo] = useState(user)

    // 회원정보 수정
    const edit = async () => {
        setIsLoadingUpdate(true)

        const result = await fetch(`/api/users/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            // session의 쿠키를 보내는데 req가 없으면 필요
            credentials: 'include',

            body: JSON.stringify({
                user: userInfo
            })
        })

        if (result.status == 200) {
            alert("저장되었습니다.")
        } else {
            alert("에러가 발생하였습니다.")
        }

        setIsLoadingUpdate(false)
    }

    // 자동 하이픈 처리
    const autoHyphen = (e: { currentTarget: { value: string } }) => {
        e.currentTarget.value = e.currentTarget.value
            .replace(/[^0-9]/g, '')
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "")

            // 전화번호 value 값 저장 -- 124 주석 참고
            // 나중에 hyPhen 처리 수정 필요 !! (01056490485를 -삽입 및 제거 필요 - 현재는 타이핑때만 작동)
            setUserInfo({ ...userInfo, phoneNumber: e.currentTarget.value })
    }

    if (userInfo == null) {
        return <></>
    } else {
        return (
            <>
                <Head>
                    <title>마이페이지</title>
                </Head>
                <Layout>
                    <Text h1>회원정보 수정</Text>
                    {accountProviders &&
                        <Card css={{mb: '$12', $$cardColor: '$colors$gradient' }}>
                            <Card.Body>
                                <Text b color="white">현재 계정이 {accountProviders[0].toLocaleUpperCase()}(으)로 연결되어있습니다.</Text>
                            </Card.Body>
                        </Card>
                    }

                    <Card variant="flat">
                        <Card.Body>
                            <Text b>리뷰오더 머니</Text>
                            <Text h3 css={{mb: 0}}>{userInfo.money.toLocaleString()} 원</Text>
                            <Button flat auto color="warning" size="sm" css={{mt: 8, ml: 'auto'}} icon={<TbPigMoney />}>충전</Button>
                        </Card.Body>
                    </Card>
                    <Spacer />
                    <form>
                        <fieldset disabled={isLoadingUpdate} style={{margin: 0, padding: 0, borderWidth: '0'}}>
                            <Input 
                                type="text"
                                name="name"
                                label="이름"
                                placeholder={placeholder.name}
                                initialValue={userInfo.name ?? undefined} 
                                shadow={false}
                                fullWidth={true}
                                helperText="주문 혹은 리뷰 작성시 나타나는 이름을 입력하세요."
                                onChange={(e)=>setUserInfo({ ...userInfo, name: e.currentTarget.value })}
                                />
                            <Spacer y={2} />
                            <Input 
                                type="email" 
                                label="이메일"
                                placeholder={placeholder.email}
                                initialValue={userInfo.email ?? undefined} 
                                shadow={false}
                                fullWidth={true}
                                onChange={(e)=>setUserInfo({ ...userInfo, email: e.currentTarget.value })}
                                />
                            <Spacer y={2} />
                            <Input 
                                type="tel" 
                                label="휴대폰 번호"
                                placeholder={placeholder.tel}
                                initialValue={userInfo.phoneNumber ?? undefined} 
                                shadow={false}
                                fullWidth={true}

                                // onChange에 이벤트 2개를 동시에 못해서 autoHyphen에서 value값 저장
                                onChange={autoHyphen}
                                />
                            <Spacer y={2} />
                            <Textarea
                                // 초기 TextArea 크기 ex) 5줄
                                rows={5}

                                label="전달사항"
                                placeholder={placeholder.allergy}
                                initialValue={userInfo.allergy ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                onChange={(e)=>setUserInfo({ ...userInfo, allergy: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Button flat onPress={() => edit()} css={{ml: 'auto'}} icon={!isLoadingUpdate && <FaPencilAlt />} disabled={isLoadingUpdate}>
                                {isLoadingUpdate ? <Loading type="points-opacity" color="currentColor" size="sm" /> : <>저장</>}
                            </Button>
                        </fieldset>
                    </form>
                </Layout>
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/users/`,{
        method: "GET",
        headers: {
            // session의 쿠키 전달
            cookie: req.headers.cookie || "",
        }
    })

    const response = await result.json().then(data => data as UserAPIGETResponse) // any to User
    const user = response.data
    const accountProviders = await getAccountProviders(user.id)

    return {
        props: { 
            user: user, 
            accountProviders: accountProviders
        }
    }
}
