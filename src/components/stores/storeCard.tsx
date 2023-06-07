import { useRouter } from 'next/router'

import { Card, Text, Button, Spacer, Row, Grid } from '@nextui-org/react'
import { FaStore } from 'react-icons/fa'
import Link from 'next/link'
import { Store } from '@prisma/client'

export type StoreCardProps = {
    store: Store
}

export default ({ store }: StoreCardProps) => {
    const router = useRouter()

    return (
        <Card variant="flat">
            <Card.Header>
                <Row wrap="wrap" justify="space-between" align="center">
                    <Text h4 css={{ mb: 0 }}>
                        {store.name}
                    </Text>
                    <Text color="$colors$neutral" small>
                        {store.address}
                    </Text>
                </Row>
            </Card.Header>
            <Card.Body css={{ p: 0, flexGrow: 'unset' }}>
                <Card.Image
                    src={store.image ?? 'http://via.placeholder.com/640x480'}
                    objectFit="cover"
                    width="100%"
                    height={300}
                    alt="매장 사진"
                    showSkeleton
                />
            </Card.Body>
            <Card.Footer css={{ color: '$accents7', fontWeight: '$semibold', fontSize: '$sm' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ alignSelf: 'stretch' }}>
                        {store.description?.split('#').map((str, index) => {
                            if (str != '') str = '#' + str
                            if (str.startsWith('#')) {
                                return (
                                    <span key={str}>
                                        <Link
                                            //onClick={(e) => onChangeQuery(e.currentTarget.text.replace('#', ''))}
                                            href={{ pathname: `s`, query: { search: `${str.replace('#', '')}` } }}
                                        >
                                            {str}
                                        </Link>{' '}
                                    </span>
                                )
                            }
                            return str + ' '
                        })}
                    </div>
                    <Spacer y={0.5} />
                    <Button
                        css={{ width: '100%' }}
                        color="gradient"
                        icon={<FaStore />}
                        onPress={() => router.push(`/stores/${store.id}`)}
                    >
                        매장 둘러보기
                    </Button>
                </div>
            </Card.Footer>
        </Card>
    )
}
