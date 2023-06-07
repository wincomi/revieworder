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
        const { files } = await readFile(req, true)
        const uploadedImage = files.myImage as formidable.File
        const imageBuffer = await fs.readFile(uploadedImage.filepath)

        /// 파일명 : 당시 시간.png - 띄어쓰기 없음
        const fileName = Date.now().toString + '.png'

        /// 서버 업로드용 파일명, public/images/당시 시간.png
        const uploadFilePath = '/public/images/' + fileName

        /// 이미지 호스팅 경로, 기본: name='당시 시간.png', name=당시 시간.png로 수정해야 할 수도 있음
        const writeFilePath = 'https://revieworder.kr/images?name=' + "'/" + fileName + "'"

        fs.writeFile('.' + uploadFilePath, imageBuffer, 'base64')
        res.json({ filename: writeFilePath, done: 'ok' })
    }
}

export default handler
