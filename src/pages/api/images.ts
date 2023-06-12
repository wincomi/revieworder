import { NextApiHandler, NextApiRequest } from 'next'
import formidable from 'formidable'
import fs from 'fs/promises'

export const config = {
    api: {
        bodyParser: false,
    },
}

const readFile = (
    req: NextApiRequest,
    saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    const options: formidable.Options = {}
    /// 아래는 의미없는 코드들이지만, 당장 새 오류가 생길수도 있으니 방치
    if (saveLocally) {
        options.uploadDir = './public/images'
        options.filename = () => {
            return Date.now().toString()
        }
    }
    /// 여기까지
    options.maxFileSize = 4000 * 1024 * 1024
    const form = formidable(options)
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err)
            resolve({ fields, files })
        })
    })
}

const handler: NextApiHandler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            await fs.readdir('./public/images')
        } catch (error) {
            await fs.mkdir('./public/images')
        }
        console.log('handler1')
        const { files } = await readFile(req, true)
        console.log('handler2')
        const uploadedImage = files.myImage as formidable.File
        console.log('handler3')
        const imageBuffer = await fs.readFile(uploadedImage.filepath)
        console.log('handler4')

        /// 파일명 : 당시 시간.png - 띄어쓰기 없음
        console.log('' + Date.now())
        const fileName = '' + Date.now() + '.png'
        console.log(fileName)
        /// 서버 업로드용 파일명, public/images/당시 시간.png
        const uploadFilePath = '/public/images/' + fileName

        /// 이미지 호스팅 경로, 기본: name='/당시 시간.png', name='당시 시간.png'로 수정해야 할 수도 있음
        const writeFilePath = 'https://revieworder.kr/images/' + fileName
        console.log(uploadFilePath)
        console.log(writeFilePath)
        await fs.writeFile('.' + uploadFilePath, imageBuffer, 'base64')
        res.json({ filename: writeFilePath, done: 'ok' })
        return res
    }
}

export default handler
