import { Dropdown, Navbar, User, Text, Button, Link, Loading } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Key } from 'react'
import { HiLogout, HiOutlinePencil, HiOutlineSwitchHorizontal } from 'react-icons/hi'
import { MdStore, MdLocalGroceryStore } from 'react-icons/md'

export default () => {
    const session = useSession()
    const router = useRouter()

    const dropdownAction: (key: Key) => void = (key) => {
        switch (key) {
            case 'logout':
                signOut()
                break
            default:
                router.push('/' + key)
                break
        }
    }

    if (session.data?.user != null) {
        return (
            <Dropdown placement="bottom-right">
                <Navbar.Item>
                    <Dropdown.Trigger>
                        <User
                            bordered
                            as="button"
                            size="md"
                            name={session.data.user.name ?? '이름 없음'}
                            src={session.data.user.image ?? undefined}
                        />
                    </Dropdown.Trigger>
                </Navbar.Item>
                <Dropdown.Menu onAction={dropdownAction} disabledKeys={[router.pathname.substring(1)]}>
                    <Dropdown.Item key="profile">
                        <Text b color="inherit" css={{ d: 'flex' }}>
                            {session.data.user.name ?? '이름 없음'}
                        </Text>
                    </Dropdown.Item>
                    <Dropdown.Item key="profile" withDivider icon={<HiOutlinePencil />}>
                        회원정보 수정
                    </Dropdown.Item>
                    <Dropdown.Item key="order" withDivider icon={<MdLocalGroceryStore />}>
                        내 주문내역
                    </Dropdown.Item>
                    <Dropdown.Item key="review" withDivider icon={<MdLocalGroceryStore />}>
                        My리뷰
                    </Dropdown.Item>
                    <Dropdown.Item key="admin" withDivider icon={<MdStore />}>
                        My매장
                    </Dropdown.Item>
                    <Dropdown.Item key="profile/sns" icon={<HiOutlineSwitchHorizontal />}>
                        SNS 연동
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" withDivider color="error" icon={<HiLogout />}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    } else {
        // 로그인이 되어 있지 않을 때
        return (
            <Navbar.Item>
                <Button
                    auto
                    flat
                    as={Link}
                    onPress={() => {
                        signIn()
                    }}
                >
                    {session.status == 'loading' ? <Loading type="points-opacity" /> : <>로그인</>}
                </Button>
            </Navbar.Item>
        )
    }
}
