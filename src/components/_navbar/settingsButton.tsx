import { useTheme as useNextTheme } from 'next-themes'
import { useTheme } from '@nextui-org/react'

import { Dropdown, Navbar } from '@nextui-org/react'
import { FaBolt, FaMoon, FaSun } from 'react-icons/fa'
import { BsGearFill } from 'react-icons/bs'
import { useState } from 'react'

export default () => {
    const { setTheme } = useNextTheme()
    const { type: themeType } = useTheme()

    const [selectedTheme, setSelectedTheme] = useState(new Set([themeType]))

    return (
        <Dropdown>
            <Navbar.Item>
                <Dropdown.Button auto flat light rounded icon={<BsGearFill />} />
            </Navbar.Item>
            <Dropdown.Menu
                color="primary"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={selectedTheme}
                onSelectionChange={(keys) => {
                    const key = Array.from(keys).join()
                    setSelectedTheme(new Set([key]))
                    setTheme(key)
                }}
            >
                <Dropdown.Section title="테마">
                    <Dropdown.Item key="system" icon={<FaBolt />}>
                        시스템 설정
                    </Dropdown.Item>
                    <Dropdown.Item key="light" icon={<FaSun />}>
                        라이트 모드
                    </Dropdown.Item>
                    <Dropdown.Item key="dark" icon={<FaMoon />}>
                        다크 모드
                    </Dropdown.Item>
                </Dropdown.Section>
            </Dropdown.Menu>
        </Dropdown>
    )
}
