import { Navbar, Text, Link, Spacer } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { ImSpoonKnife } from 'react-icons/im'

import { ReactNode } from 'react'

export type NavbarMenuItem = {
  id: string
  name: string,
  path: string,
  icon?: ReactNode
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
            <ImSpoonKnife style={{ verticalAlign: 'text-bottom'}} /> {title}
          </Text>
        </Link>
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" activeColor={activeColor} variant="underline-rounded" >
        {menu.map((item) =>
          <Navbar.Link
            key={item.id}
            onClick={() => router.push(item.path)}
            isActive={router.pathname == item.path}
          >
            {item.icon}
            <Spacer x={0.25} />
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
