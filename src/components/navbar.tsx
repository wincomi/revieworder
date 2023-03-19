import { Button, Navbar, Text, Link, Loading, User, Dropdown, Badge } from '@nextui-org/react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Key } from 'react'
import { FaBars, FaBolt, FaMoon, FaShoppingCart, FaSun } from 'react-icons/fa'
import { HiOutlinePencil, HiOutlineSwitchHorizontal, HiLogout, HiSearch } from 'react-icons/hi'

import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme } from '@nextui-org/react'
import { useState, useMemo } from 'react'

export type NavbarMenuItem = {
  id: string
  name: string,
  path: string,
}

export interface NavbarProps {
  menu: NavbarMenuItem[]
}

export default ({ menu }: NavbarProps) => {
    const router = useRouter()
    const session = useSession()
    const { setTheme } = useNextTheme()
    const { isDark, type } = useTheme()

    const [selectedTheme, setSelectedTheme] = useState(new Set([ type ]))

    const dropdownAction: (key: Key) => void = (key) => {
      switch (key) {
        case "logout":
          signOut()
          break
        default:
          router.push("/" + key)
          break
      }
    }

    function UserButton() {
        if (session.data?.user != null) {
            return (
              <Dropdown placement="bottom-right">
                <Navbar.Item>
                  <Dropdown.Trigger>
                    <User
                        bordered
                        as="button"
                        size="md"
                        name={session.data.user.name ?? "이름 없음"}
                        src={session.data.user.image ?? undefined}
                      />
                  </Dropdown.Trigger>
                </Navbar.Item>
                <Dropdown.Menu onAction={dropdownAction} disabledKeys={[router.pathname.substring(1)]}>
                  <Dropdown.Item key="profile">
                    <Text b color="inherit" css={{ d: "flex" }}>
                      {session.data.user.name ?? "이름 없음"}
                    </Text>
                  </Dropdown.Item>
                  <Dropdown.Item key="profile/edit" withDivider icon={<HiOutlinePencil />}>
                    회원정보 수정
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
                <Button auto flat as={Link} onPress={() => { signIn() }}>
                  {session.status == "loading" ? <Loading type="points-opacity" /> : <>로그인</>}
                </Button>
              </Navbar.Item>
            )
        }
    }

    return (
        <>
            <Navbar variant="sticky">
                <Navbar.Brand>
                  <Link onClick={() => router.push('/')}>
                    <Text b color="text" css={{fontSize: 20, ml: 8}}>
                      리뷰오더
                    </Text>
                  </Link>
                </Navbar.Brand>
                <Navbar.Content hideIn="xs" variant="highlight">
                    {menu.map((item) => 
                        <Navbar.Link key={item.id} onClick={() => router.push(item.path)} isActive={router.pathname == item.path}>
                            {item.name}
                        </Navbar.Link>
                    )}
                </Navbar.Content>
                <Navbar.Content>
                  <Dropdown>
                    <Navbar.Item>
                      <Dropdown.Button auto flat>
                        <FaBars />
                      </Dropdown.Button>
                    </Navbar.Item>
                    <Dropdown.Menu
                      color="primary"
                      selectionMode="single"
                      disallowEmptySelection
                      selectedKeys={selectedTheme}
                      onSelectionChange={ (keys) => {
                        const key = Array.from(keys).join()
                        setSelectedTheme(new Set([ key ]))
                        setTheme(key) 
                      }}
                    >
                      <Dropdown.Section title="테마">
                        <Dropdown.Item key="system" icon={<FaBolt />}>시스템 설정</Dropdown.Item>
                        <Dropdown.Item key="light" icon={<FaSun />}>라이트 모드</Dropdown.Item>
                        <Dropdown.Item key="dark" icon={<FaMoon />}>다크 모드</Dropdown.Item>
                      </Dropdown.Section>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Badge color="error" content="5" shape="circle" disableAnimation>
                    <Button onPress={() => router.push('/cart')} icon={<FaShoppingCart />} auto color="gradient"></Button>
                  </Badge>
                  <UserButton />
                </Navbar.Content>
            </Navbar>
        </>
    )
}
