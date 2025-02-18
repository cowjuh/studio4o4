import { useEffect, useState } from 'react'
import { generatePreviewImage } from '@/utils/generatePreviewImage'

interface PreviewImageProps {
  title: string;
  backgroundImage: string;
  onPreviewGenerated?: (previewUrl: string) => void;
}

const PreviewImage = ({ title, backgroundImage, onPreviewGenerated }: PreviewImageProps) => {
  const [previewImage, setPreviewImage] = useState<string>(backgroundImage)

  useEffect(() => {
    const generatePreview = async () => {
      try {
        const preview = await generatePreviewImage(title, backgroundImage)
        setPreviewImage(preview)
        onPreviewGenerated?.(preview)
      } catch (error) {
        console.error('Failed to generate preview:', error)
      }
    }

    generatePreview()
  }, [title, backgroundImage, onPreviewGenerated])

  if (import.meta.env.DEV !== true) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white p-2 rounded shadow-lg">
      <p className="text-sm mb-2">DEV - Preview Image Test:</p>
      <img 
        src={previewImage} 
        alt="Preview Test" 
        className="w-[300px] h-auto border border-black"
      />
    </div>
  )
}

export default PreviewImage 