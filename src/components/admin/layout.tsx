import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar from '@/components/_navbar/navbar'
import { NavbarMenuItem } from '@/components/_navbar/navbar'
import NavbarUserButton from '@/components/navbarUserDropdown'

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
                <NavbarUserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
