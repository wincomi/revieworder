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
        if (session.status == "loading") {
            return <Loading type="points-opacity" />
        } else if (session.data?.user != null) {
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
                  <Dropdown.Item key="profile">
                    <Text b color="inherit" css={{ d: "flex" }}>
                      {session.data.user.name}
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item key="mypage" withDivider>
                    회원정보 수정
                  </Dropdown.Item>
                  <Dropdown.Item key="logout" withDivider color="error">
                    로그아웃
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
            )
        } else {
            // 로그인이 되어 있지 않을 때
            return <Navbar.Link color="inherit" onPress={() => signIn()}>로그인</Navbar.Link>
        }
    }

    return (
        <>
            <Navbar variant="sticky">
                <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs">
                        리뷰오더
                    </Text>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs">
                    {menu.map((item) => 
                        <Navbar.Link key={item.id} href={item.path} isActive={router.pathname == item.path}>
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
