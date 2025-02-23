import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import ImageGallery from '@components/ImageGallery'
import PackageCard from '@components/PackageCard'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import BookingSection from '@components/BookingSection'
import LocationSection from '@components/LocationSection'
import CancellationSection from '@components/CancellationSection'
import PreviewImage from '@components/PreviewImage'

// Dynamically import all images from the modeling directory
const imageModules = import.meta.glob('@assets/images/digitals/*.{png,jpg,jpeg}', { eager: true })
const GALLERY_IMAGES = Object.values(imageModules).map(module => (module as { default: string }).default)

const ModelingPage = () => {
  const [previewImage, setPreviewImage] = useState(GALLERY_IMAGES[0])

  return (
    <>
      <Head
        title="Modeling Digitals Photography"
        description="Professional modeling digitals photography in Brooklyn. High-quality comp cards and portfolio shots for models. Packages starting at $175."
        image={previewImage}
        path="/modeling"
      />
      <PreviewImage 
        title="Modeling Digitals"
        backgroundImage={GALLERY_IMAGES[0]}
        onPreviewGenerated={setPreviewImage}
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">Modeling Digitals</h1>
        
        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="Packages">
          <div className="space-y-8">
            <PackageCard
              title="1 Look Package"
              price={200}
              duration="1hr"
              description='For modeling, acting, and photos with specific requirements.'
              details={[
                '1 outfit',
                'Portraits, Half body, Full body, Stylistic poses',
                '15 selects',
                'Up to 3 retouched photos',
                'Photos delivered within 5 days',
              ]}
            />
            <PackageCard
              title="2 Looks Package"
              price={325}
              duration="1.5hr"
              description='For modeling, acting, and photos with specific requirements.'
              details={[
                '2 outfits',
                'Portraits, Half body, Full body, Stylistic poses',
                '30 selects',
                'Up to 6 retouched photos',
                'Photos delivered within 5 days',
              ]}
            />
          </div>
        </PageSection>

        <PageSection title="Add On's">
          <div className="space-y-2">
            <h3 className="font-medium">Next Day Delivery — Additional $50</h3>
            <p className="text-sm text-neutral-600">
              Booking appointment must be at 11am at the latest
              <br />
              Photos delivered and retouched same day
            </p>
          </div>
        </PageSection>

        <BookingSection />
        <LocationSection />
        <CancellationSection />
      </div>
    </>
  )
}

export const Route = createFileRoute('/_service/modeling/')({
  component: ModelingPage
}) 