import { Navbar, Text, Link, Loading, User, Dropdown, Badge } from '@nextui-org/react'
import { useRouter } from 'next/router'

import { ReactNode } from 'react'

export type NavbarMenuItem = {
  id: string
  name: string,
  path: string,
}

export interface NavbarProps {
  title: string,
  menu: NavbarMenuItem[],
  activeColor?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "neutral",
  children?: ReactNode
}

export default ({ title, menu, activeColor, children }: NavbarProps) => {
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
      <Navbar.Content hideIn="xs" activeColor={activeColor} variant="highlight-rounded" enableCursorHighlight>
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
        {children}
      </Navbar.Content>
    </Navbar>
  )
}
