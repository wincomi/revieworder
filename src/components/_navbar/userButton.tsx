import { Dropdown, Navbar, User, Text, Button, Link, Loading } from '@nextui-org/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Key } from 'react'
import { HiLogout, HiOutlinePencil } from 'react-icons/hi'
import { MdLocalGroceryStore, MdRateReview, MdStore } from 'react-icons/md'

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
                        <User bordered as="button" size="md" name={''} src={session.data.user.image ?? undefined} />
                    </Dropdown.Trigger>
                </Navbar.Item>
                <Dropdown.Menu onAction={dropdownAction} color="primary" selectedKeys={[router.pathname.substring(1)]}>
                    <Dropdown.Section title={session.data.user.name ?? '이름 없음'}>
                        <Dropdown.Item key="profile" icon={<HiOutlinePencil />}>
                            회원정보 수정
                        </Dropdown.Item>
                    </Dropdown.Section>
                    <Dropdown.Section title="고객">
                        <Dropdown.Item key="order" icon={<MdLocalGroceryStore />}>
                            내 주문 내역
                        </Dropdown.Item>
                        <Dropdown.Item key="review" icon={<MdRateReview />}>
                            내 리뷰
                        </Dropdown.Item>
                    </Dropdown.Section>
                    <Dropdown.Section title="판매자">
                        <Dropdown.Item key="admin" icon={<MdStore />}>
                            내 매장
                        </Dropdown.Item>
                    </Dropdown.Section>
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
