import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ImageGallery from '@components/ImageGallery'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import PreviewImage from '@components/PreviewImage'

const imageModules = import.meta.glob('@assets/images/space/*.{png,jpg,jpeg}', { eager: true })
const GALLERY_IMAGES = Object.values(imageModules).map(module => (module as { default: string }).default)

const SpacePage = () => {
  const [previewImage, setPreviewImage] = useState(GALLERY_IMAGES[0])

  return (
    <>
      <Head
        title="THE SPACE - Studio 4O4"
        description="A creative photography studio space in Brooklyn. Perfect for photoshoots, small events, and creative collaborations. Natural light, high ceilings, and professional equipment available."
        image={previewImage}
        path="/space"
      />
      <PreviewImage 
        title="THE SPACE"
        backgroundImage={GALLERY_IMAGES[0]}
        onPreviewGenerated={setPreviewImage}
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">THE SPACE</h1>

        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="Book The Space">
          <div className="space-y-4">
            <p className="text-sm">
              For studio inquiries and bookings, please reach out:
            </p>
            <p className="text-sm">
              DM <span className="font-medium">@cowjuh</span> on Instagram or email <span className="font-medium">cowjuh@gmail.com</span>
            </p>
          </div>
        </PageSection>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_service/space/')({
  component: SpacePage,
}) 