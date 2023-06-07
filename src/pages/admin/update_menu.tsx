import Head from 'next/head'
import { Button, Spacer, Input, Textarea, Dropdown } from '@nextui-org/react'
import Layout from '@/components/admin/layout'

import { useState } from 'react'
import { GetServerSideProps } from 'next'
import React from 'react'
import { MenuAPIGETResponse, MenuItem } from '../api/menus'
import { Menu, Prisma, Store } from '@prisma/client'
import router from 'next/router'

// 메뉴 api upsert 구현해서 기존에 있으면 업데이트, 없으면 생성 -> 기준 (이름, 가격)

interface MenuEditPageProps {
    /// 선택된 메뉴 정보
    menu: MenuItem
}

export default function menuEnroll({ menu }: MenuEditPageProps) {
    const store: Store = JSON.parse(router.query.store as string)

    if (menu == undefined && store != undefined) {
        const [menuItem, setMenuItem] = useState<Prisma.MenuCreateInput>({
            name: '',
            description: '',
            price: 0,
            image: '',
            store: store as Prisma.StoreCreateNestedOneWithoutMenusInput,
        })

        const create = async () => {
            const result = await fetch(`/api/menus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    inputMenu: menuItem,
                }),
            })

            if (result.status == 200) {
                alert('메뉴 등록 완료.')
                router.push(`/admin/store?id=${store.id}`)
            } else {
                alert('메뉴 등록 실패.')
            }
        }

        return (
            <>
                <Head>
                    <title>{store.name} - 메뉴 등록</title>
                </Head>
                <Layout>
                    <form>
                        <fieldset style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                            <Input
                                type="text"
                                name="name"
                                label="메뉴 이름"
                                placeholder=""
                                shadow={false}
                                fullWidth={true}
                                helperText="메뉴 이름을 입력하세요."
                                onChange={(e) => setMenuItem({ ...menuItem, name: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="image"
                                label="이미지"
                                placeholder=""
                                initialValue={menuItem.image ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, image: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="price"
                                label="메뉴 가격"
                                placeholder="0"
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, price: Number(e.currentTarget.value) })}
                            />
                            <Spacer y={2} />
                            <Textarea
                                // 초기 TextArea 크기 ex) 5줄
                                rows={5}
                                label="메뉴 설명"
                                placeholder="#메뉴#설명"
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, description: e.currentTarget.value })}
                            />
                            <Button onPress={create}>메뉴 등록</Button>
                        </fieldset>
                    </form>
                </Layout>
            </>
        )
    } else if (menu != undefined) {
        const [menuItem, setMenuItem] = useState(menu as Menu)

        const edit = async () => {
            const result = await fetch(`/api/menus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    menu: menuItem,
                }),
            })

            if (result.status == 200) {
                alert('메뉴 수정 완료.')
                router.push(`/admin/store?id=${store.id}`)
            } else {
                alert('메뉴 수정 실패.')
            }
        }

        const del = async () => {
            const result = await fetch(`/api/menus`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                // session의 쿠키를 보내는데 req가 없으면 필요
                credentials: 'include',

                body: JSON.stringify({
                    menu: menu,
                }),
            })

            if (result.status == 200) {
                alert('메뉴 삭제 완료.')
                router.push(`/admin/store?id=${store.id}`)
            } else {
                alert('메뉴 삭제 실패.')
            }
        }

        return (
            <>
                <Head>
                    <title>{store.name} - 메뉴 수정</title>
                </Head>
                <Layout>
                    <form>
                        <fieldset style={{ margin: 0, padding: 0, borderWidth: '0' }}>
                            <Input
                                type="text"
                                name="name"
                                label="메뉴 이름"
                                placeholder=""
                                initialValue={menuItem.name ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                helperText="메뉴 이름을 입력하세요."
                                onChange={(e) => setMenuItem({ ...menuItem, name: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="image"
                                label="이미지"
                                placeholder=""
                                initialValue={menuItem.image ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, image: e.currentTarget.value })}
                            />
                            <Spacer y={2} />
                            <Input
                                type="price"
                                label="메뉴 가격"
                                placeholder="0"
                                initialValue={menuItem.price.toLocaleString() ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, price: Number(e.currentTarget.value) })}
                            />
                            <Spacer y={2} />
                            <Textarea
                                // 초기 TextArea 크기 ex) 5줄
                                rows={5}
                                label="메뉴 설명"
                                placeholder="#메뉴#설명"
                                initialValue={menuItem.description ?? undefined}
                                shadow={false}
                                fullWidth={true}
                                onChange={(e) => setMenuItem({ ...menuItem, description: e.currentTarget.value })}
                            />
                            <Dropdown>
                                <Dropdown.Button flat color="secondary" css={{ tt: 'capitalize' }}>
                                    {menuItem.status}
                                </Dropdown.Button>
                                <Dropdown.Menu
                                    aria-label="Single selection actions"
                                    color="secondary"
                                    disallowEmptySelection
                                    selectionMode="single"
                                    disabledKeys={[menuItem.status]}
                                >
                                    <Dropdown.Item key="AVAILABLE">판매 가능</Dropdown.Item>
                                    <Dropdown.Item key="UNAVAILABLE">판매 불가</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button onPress={edit}>메뉴 수정</Button>
                            <Button onPress={del}>메뉴 삭제</Button>
                        </fieldset>
                    </form>
                </Layout>
            </>
        )
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const menuId = context.query.id ?? ''

    if (menuId == '') {
        return {
            props: {},
        }
    }
    // storeId 해당 매장 정보
    const result = await fetch(`${process.env.NEXTAUTH_URL}/api/menus?id=${menuId}`, {
        method: 'GET',
        headers: {
            // session의 쿠키 전달
            cookie: context.req.headers.cookie || '',
        },
    })
    const response = await result.json().then((data) => data as MenuAPIGETResponse)
    const menu = response.data

    return {
        props: { menu },
    }
}
