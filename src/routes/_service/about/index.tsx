import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ImageGallery from '@components/ImageGallery'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import PreviewImage from '@components/PreviewImage'

// Use the same images as editorial
const imageModules = import.meta.glob('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })
const GALLERY_IMAGES = Object.values(imageModules).map(module => (module as { default: string }).default)

const AboutPage = () => {
  const [previewImage, setPreviewImage] = useState(GALLERY_IMAGES[0])

  return (
    <>
      <Head
        title="About Our Photography Studio"
        description="4o4.space STUDIO is a professional photography studio in Bushwick, Brooklyn. Founded by Jenny Zhang, we specialize in modeling digitals, headshots, and editorial photography."
        image={previewImage}
        path="/about"
      />
      <PreviewImage 
        title="About"
        backgroundImage={GALLERY_IMAGES[0]}
        onPreviewGenerated={setPreviewImage}
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">About</h1>
        
        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="About the Studio">
          <div className="prose prose-sm">
            <p>
              4o4.space STUDIO is a photography studio based in Bushwick, Brooklyn. 
              Specializing in modeling digitals, headshots, and editorial photography, 
              we provide professional photography services in a comfortable and creative environment.
            </p>
            <p className="mt-4">
              Founded by Jenny Zhang, the studio aims to create a space where models, 
              actors, and creatives can get high-quality photos that capture their 
              best angles and showcase their unique features.
            </p>
          </div>
        </PageSection>

        <PageSection title="Contact">
          <div className="space-y-2">
            <p className="text-sm">
              For inquiries: DM @cowjuh on IG or email bookings@4o4.space
            </p>
            <p className="text-sm">
              Location: Bushwick, Brooklyn (3 min walk from Morgan Ave L stop)
            </p>
          </div>
        </PageSection>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_service/about/')({
  component: AboutPage,
}) 