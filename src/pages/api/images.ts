import { NextApiHandler, NextApiRequest } from 'next'
import formidable from 'formidable'
import path from 'path'
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
    if (saveLocally) {
        options.uploadDir = path.join(process.cwd(), '/public/images')
        options.filename = (name, ext, path) => {
            return '' + path.originalFilename
        }
    }
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
            await fs.readdir(path.join(process.cwd() + '/public', '/images'))
        } catch (error) {
            await fs.mkdir(path.join(process.cwd() + '/public', '/images'))
        }
        const { fields, files } = await readFile(req, true)
        const uploadedImage = files.myImage as formidable.File
        const imageBuffer = await fs.readFile(uploadedImage.filepath)

        fs.writeFile(fields.filename as string, imageBuffer, 'base64')
        res.json({ done: 'ok' })
    }
}

export default handler
