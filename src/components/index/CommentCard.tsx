import { User, Card, Row, Text, Button, Spacer, Tooltip, Loading, Grid } from '@nextui-org/react'
import { Prisma } from '@prisma/client'
import { format, formatDistance } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useSession } from 'next-auth/react'

interface Comment {
    id: number
    reviewId: string
    text: string
    userId: string
    createTime: Date
}

const userInfo = Prisma.validator<Prisma.UserArgs>()({})
type user = Prisma.UserGetPayload<typeof userInfo>

interface CommentProps {
    commentProps: Comment[]
    users: user[]
}

export default ({ commentProps, users }: CommentProps) => {
    if ((commentProps == null || commentProps == undefined) && (users == null || users == undefined)) {
        return <Loading />
    }

    const getUser = (userID: string) => {
        const userInfo = users.find((user: user) => {
            if (user.id == userID) {
                return user
            }
        })
        return userInfo
    }
    return (
        <>
            {commentProps.map((comment, index) => (
                <>
                    <Spacer y={0.5} />
                    <Card key={index} variant="flat">
                        <Card.Header>
                            <User
                                src={getUser(comment.userId)?.image ?? 'http://via.placeholder.com/64x64'}
                                name={getUser(comment.userId)?.name ?? '익명'}
                                size="sm"
                                css={{ px: 0 }}
                            />
                            <Spacer x={0.4} />
                            <Tooltip
                                content={format(new Date(comment.createTime), 'yyyy-MM-dd HH:mm:ss')}
                                placement="left"
                                color="invert"
                            >
                                <Text css={{ color: '$accents7', fontSize: '$xs' }}>
                                    {formatDistance(new Date(comment.createTime), new Date(), {
                                        addSuffix: true,
                                        locale: ko,
                                    })}
                                </Text>
                            </Tooltip>
                        </Card.Header>
                        <Card.Body>
                            <span key={index}>{comment.text}</span>
                        </Card.Body>
                    </Card>
                </>
            ))}
        </>
    )
}
