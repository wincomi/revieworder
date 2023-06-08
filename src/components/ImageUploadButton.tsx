import React, { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { Button, Spacer } from '@nextui-org/react'
import Image from 'next/image'
import { FaFileImage, FaUpload } from 'react-icons/fa'

export type ImgProps = {
    uploaded: Dispatch<SetStateAction<boolean>>
    onChangeImage: Dispatch<SetStateAction<string>>
}

export default ({ uploaded, onChangeImage: onChangeImage }: ImgProps) => {
    const [selectedFile, setSelectedFile] = useState<string | File | null>('')
    const [previewUrl, setPreviewUrl] = useState<string | null>('')
    const fileInput = useRef<HTMLInputElement>(null)
    const [isUploaded, setIsUploaded] = useState<boolean>(false)

    const handleUploadClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setPreviewUrl(URL.createObjectURL(file))
            setSelectedFile(file)
        }
    }

    const handleUpload = async () => {
        if (selectedFile) {
            console.log(selectedFile)
            const formData = new FormData()
            formData.append('myImage', selectedFile)
            try {
                const response = await fetch('/api/images', {
                    body: formData,
                    method: 'POST',
                })

                // 1회용 업로드 url 발급
                // const response = await await fetch(
                //     `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ID}/images/v2/direct_upload `,
                //     {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json',
                //             Authorization: `Bearer ${process.env.CF_TOKEN}`,
                //         },
                //     }
                // )
                //
                //const uploadURL = await response.json()
                //
                // 해당 url로 이미지 업로드
                // await fetch(uploadURL, {
                //     method: 'POST',
                //     body: formData,
                // })

                const data = await response.json()

                // 참고 문헌
                // https://velog.io/@hunmok1027/CloudFlare%EC%97%90-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C
                // https://velog.io/@rlagurwns112/%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C-%ED%94%8C%EB%A0%88%EC%96%B4%EB%A1%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C-%ED%95%98%EA%B8%B0
                // imageId로 해당 이미지 불러옴
                // const result = data.get('result')
                // const image_Id = result.get('id')
                // const resultUploadURL = result.get('uploadURL')

                console.log(data)
                /// 업로드 후 서버의 응답 확인
                /// 업로드 성공 후 필요한 동작 수행
                onChangeImage(data.filename)
                uploaded(true)
                alert('사진 업로드를 완료하였습니다.')
                setIsUploaded(true)
            } catch (error) {
                console.error(error)
                /// 업로드 실패 시 에러 처리
            }
        }
    }

    return (
        <>
            <Button onPress={handleUploadClick} icon={<FaFileImage />} size="sm" disabled={isUploaded}>
                리뷰 사진 선택
            </Button>
            <input
                type="file"
                accept="image/*"
                ref={fileInput}
                style={{ display: 'none', width: 'auto', height: 'auto' }}
                onChange={handleFileChange}
            />
            <Spacer y={1} />
            {previewUrl && (
                <>
                    <Image src={previewUrl} alt="미리보기 사진" width={300} height={300} />
                    <Button onPress={handleUpload} icon={<FaUpload />} size="sm" flat disabled={isUploaded}>
                        사진 업로드
                    </Button>
                </>
            )}
        </>
    )
}
