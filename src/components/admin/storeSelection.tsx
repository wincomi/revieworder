import { StoreInfo } from '@/pages/api/stores'
import { Dropdown } from '@nextui-org/react'
import { Store } from '@prisma/client'
import router from 'next/router'
import { Key } from 'react'

export type storeSeletionProps = {
    stores: StoreInfo[]
}

export default ({ stores }: storeSeletionProps) => {
    const dropdownAction: (key: Key) => void = (key) => {
        router.push('/admin?storeId=' + key)
    }

    return (
        <Dropdown>
            <Dropdown.Button flat> 매장 선택 </Dropdown.Button>
            <Dropdown.Menu
                selectionMode="single"
                onAction={dropdownAction}
                disabledKeys={[router.pathname.substring(1)]}
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
