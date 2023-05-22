import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar, { NavbarMenuItem } from '@/components/_navbar/navbar'
import UserButton from '@/components/_navbar/userButton'
import { TbHomeCog } from 'react-icons/tb'
import { FaClipboardList, FaCog, FaHome } from 'react-icons/fa'
import router from 'next/router'

interface LayoutProps {
    children: ReactNode
}

export default ({ children }: LayoutProps) => {
    const id = router.query.id ?? ''

    const menu: NavbarMenuItem[] = [
        { id: 'index', name: '홈', path: '/admin', icon: <FaHome /> },
        { id: 'store', name: '매장 관리', path: `/admin/store?id=${id}`, icon: <FaCog /> },
        { id: 'order', name: '주문 관리', path: `/admin/order?id=${id}`, icon: <FaClipboardList /> },
    ]

    return (
        <main>
            <Navbar
                title="매장 관리"
                titleIcon={<TbHomeCog style={{ verticalAlign: 'middle' }} />}
                menu={menu}
                activeColor="secondary"
            >
                <UserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
