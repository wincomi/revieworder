import Image from 'next/image'
import { GetServerSideProps } from 'next/types'

/// https://revieworder.kr/images?name='asdf.png'

const hostImage = (name: string) => {
    return <Image src={name} alt="/default.png" width="256" height="256" />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { query } = context
    const name = query.param1
    if (name == undefined || name == null) {
        return {
            props: {
                name: '/default.png',
            },
        }
    }
    return {
        props: {
            name: name,
        },
    }
}

export default hostImage
