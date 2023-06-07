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
                const data = await response.json()
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
