import { StoreInfo } from '@/pages/api/stores'
import { Dropdown } from '@nextui-org/react'
import { Store } from '@prisma/client'
import router from 'next/router'
import { Key } from 'react'
import { MdStore } from 'react-icons/md'

export type storeSeletionProps = {
    stores: StoreInfo[]
}

export default ({ stores }: storeSeletionProps) => {
    const dropdownAction: (key: Key) => void = (key) => {
        router.push(router.pathname + '/?id=' + key)
    }

    return (
        <Dropdown>
            <Dropdown.Button color="gradient">
                <MdStore style={{ marginRight: '4' }} /> 매장 선택
            </Dropdown.Button>
            <Dropdown.Menu
                selectionMode="single"
                onAction={dropdownAction}
                selectedKeys={[router.pathname.substring(1)]}
            >
                {stores.map((store: Store) => (
                    <Dropdown.Item key={store.id} textValue={String(store.id)}>
                        {store.name}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )
}
