import { Container } from '@nextui-org/react'
import { ReactNode } from 'react'
import Navbar, { NavbarMenuItem } from '@/components/_navbar/navbar'
import UserButton from '@/components/_navbar/userButton'
import SettingsButton from '@/components/_navbar/settingsButton'
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa'
import { ImSpoonKnife } from 'react-icons/im'

interface LayoutProps {
    children: ReactNode
}

export default ({ children }: LayoutProps) => {
    const menu: NavbarMenuItem[] = [
        { id: 'index', name: '둘러보기', path: '/', icon: <FaHome /> },
        { id: 'cart', name: '주문하기', path: '/cart', icon: <FaShoppingCart /> },
        { id: 'profile', name: '내 프로필', path: '/profile', icon: <FaUser /> },
    ]

    return (
        <main>
            <Navbar
                title="리뷰오더"
                menu={menu}
                activeColor="primary"
                titleIcon={<ImSpoonKnife style={{ verticalAlign: 'text-bottom' }} />}
            >
                <SettingsButton />
                {/* <ShoppingCartButton count={-1} /> */}
                <UserButton />
            </Navbar>
            <Container lg css={{ mt: 32 }}>
                {children}
            </Container>
        </main>
    )
}
