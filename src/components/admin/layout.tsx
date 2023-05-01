import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar, { NavbarMenuItem } from '@/components/_navbar/navbar'
import UserButton from '@/components/_navbar/userDropdown'

interface LayoutProps {
    children: ReactNode
}

export default ({ children }: LayoutProps) => {
    const menu: NavbarMenuItem[] = [
        { id: "index", name: "홈", path: "/admin" },
        { id: "order", name: "주문", path: "/admin/order" },
        { id: "setup", name: "설정", path: "/admin/setup" },
    ]

    return (
        <main>
            <Navbar title="매장 관리" menu={menu} activeColor="secondary">
                <UserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
