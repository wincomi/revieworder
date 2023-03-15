import { Button, Navbar, Text, Link, Loading, User, Dropdown, Avatar } from '@nextui-org/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Key } from 'react'

export type NavbarMenuItem = {
  id: string
  name: string,
  path: string
}

export interface NavbarProps {
    menu: NavbarMenuItem[]
}

export default ({ menu }: NavbarProps) => {
    const router = useRouter()
    const session = useSession()

    const dropdownAction: (key: Key) => void = (key) => {
      switch (key) {
        case "mypage":
          router.push("/mypage")
          break
        case "logout":
          signOut()
          break
        default:
          break
      }
    }

    function UserButton() {
        if (session.data?.user != null) {
            return (
              <>
                <Dropdown placement="bottom-right">
                <Navbar.Item>
                  <Dropdown.Trigger>
                    <Avatar
                      bordered
                      as="button"
                      size="md"
                      src={session.data.user.image ?? undefined} 
                    />
                  </Dropdown.Trigger>
                </Navbar.Item>
                <Dropdown.Menu onAction={dropdownAction}>
                  <Dropdown.Section title={session.data.user.name}>
                    <Dropdown.Item key="mypage">
                      회원정보 수정
                    </Dropdown.Item>
                    <Dropdown.Item key="mypage/sns">
                      SNS 연동
                    </Dropdown.Item>
                    <Dropdown.Item key="logout" withDivider color="error">
                      로그아웃
                    </Dropdown.Item>
                  </Dropdown.Section>
                </Dropdown.Menu>
              </Dropdown>
            </>
            )
        } else {
            // 로그인이 되어 있지 않을 때
            return (
              <Navbar.Item>
                <Button auto flat as={Link} onPress={() => signIn()}>
                  {session.status == "loading" ? <Loading type="points-opacity" /> : <>로그인</>}
                </Button>
              </Navbar.Item>
            )
            // <Navbar.Link color="inherit" onPress={() => signIn()}>로그인</Navbar.Link>
        }
    }

    return (
        <>
            <Navbar variant="sticky">
                <Navbar.Brand>
                  <Link onPress={() => router.push('/')}>
                    <Text b color="text" css={{fontSize: 20, ml: 8}}>
                      리뷰오더
                    </Text>
                  </Link>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    {menu.map((item) => 
                        <Navbar.Link key={item.id} onPress={() => router.push(item.path)} isActive={router.pathname == item.path}>
                            {item.name}
                        </Navbar.Link>
                    )}
                </Navbar.Content>
                <Navbar.Content>
                    {UserButton()}
                </Navbar.Content>
            </Navbar>
        </>
    )
}
