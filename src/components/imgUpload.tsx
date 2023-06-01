import React, { useState, useRef, ChangeEvent } from 'react'
import { Button } from '@nextui-org/react'
import Image from 'next/image'

const Imgupload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string | File | null>('')
    const [previewUrl, setPreviewUrl] = useState<string | null>('')
    const fileInput = useRef<HTMLInputElement>(null)

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
                // 업로드 후 서버의 응답 확인

                // 업로드 성공 후 필요한 동작 수행
            } catch (error) {
                console.error(error)
                // 업로드 실패 시 에러 처리
            }
        }
    }

    return (
        <div>
            {previewUrl && <Image src={previewUrl} width="300" height="300" alt="프리뷰" />}
            <Button onPress={handleUploadClick}>이미지 선택</Button>
            <input
                type="file"
                accept="image/*"
                ref={fileInput}
                style={{ display: 'none', width: 'auto', height: 'auto' }}
                onChange={handleFileChange}
            />
            <Button onPress={handleUpload}>업로드</Button>
        </div>
    )
}

export default Imgupload
