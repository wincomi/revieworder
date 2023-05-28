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

    const goToStore = async () => {
        if (confirm('해당 매장으로 이동하시겠습니까?')) {
            router.push(`/store/${store.id}`)
        }
    }

    return (
        <Card variant="flat">
            <Card.Header>
                <Text h4>{store.name}</Text>
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
                <Row wrap="wrap" justify="space-between" align="center">
                    <Text>{store.address}</Text>
                </Row>
                <Spacer y={0.5} />
                <Grid>
                    <Grid>
                        {store.description?.split('#').map((str, index) => {
                            if (str != '') str = '#' + str
                            if (str.startsWith('#')) {
                                return (
                                    <Link
                                        key={index}
                                        href={{ pathname: `/store`, query: { search: `${str.replace('#', '')}` } }}
                                    >
                                        {str}
                                    </Link>
                                )
                            }
                            return str + ' '
                        })}
                    </Grid>

                    <Button css={{ width: '100%' }} color="gradient" icon={<FaStore />} onPress={() => goToStore()}>
                        매장 둘러보기
                    </Button>
                </Grid>
            </Card.Footer>
        </Card>
    )
}
