import { Navbar, Text, Link, Loading, User, Dropdown, Badge } from '@nextui-org/react'
import { useRouter } from 'next/router'

import NavbarUserButton from '@/components/navbarUserDropdown'
import NavbarThemeButton from '@/components/navbarThemeDropdown'
import ShoppingCartButton from '@/components/shoppingCartButton'

export type NavbarMenuItem = {
  id: string
  name: string,
  path: string,
}

export interface NavbarProps {
  title: string,
  menu: NavbarMenuItem[]
}

export default ({ title, menu }: NavbarProps) => {
  const router = useRouter()
  
  return (
    <Navbar variant="sticky">
      <Navbar.Brand>
        <Link onClick={() => router.push('/')}>
          <Text b color="text" css={{ fontSize: 20, ml: 8 }}>
            {title}
          </Text>
        </Link>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="highlight" enableCursorHighlight>
        {menu.map((item) =>
          <Navbar.Link
            key={item.id}
            onClick={() => router.push(item.path)}
            isActive={router.pathname == item.path}
          >
            {item.name}
          </Navbar.Link>
        )}
      </Navbar.Content>
      <Navbar.Content>
        <ShoppingCartButton />
        <NavbarThemeButton />
        <NavbarUserButton />
      </Navbar.Content>
    </Navbar>
  )
}
