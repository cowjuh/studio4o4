import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '@components/ImageGallery'
import PackageCard from '@components/PackageCard'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import BookingSection from '@components/BookingSection'
import LocationSection from '@components/LocationSection'
import CancellationSection from '@components/CancellationSection'

// Import gallery images
import leahDigitals1 from '@assets/images/digitals/Leah Digitals0292 1.jpg'
import leahDigitals2 from '@assets/images/digitals/Leah Digitals0277 1.jpg'
import leahDigitals3 from '@assets/images/digitals/Leah Digitals0216 1.jpg'
import leahDigitals4 from '@assets/images/digitals/Leah Digitals0061 1.jpg'
import img3450 from '@assets/images/digitals/IMG_3450.jpg'
import img3415 from '@assets/images/digitals/IMG_3415.jpg'
import img3405 from '@assets/images/digitals/IMG_3405-Edit.jpg'
import img3378 from '@assets/images/digitals/IMG_3378-Edit.jpg'
import img3356 from '@assets/images/digitals/IMG_3356.jpg'

// Gallery images array
const GALLERY_IMAGES = [
  leahDigitals1,
  leahDigitals2,
  leahDigitals3,
  leahDigitals4,
  img3450,
  img3415,
  img3405,
  img3378,
  img3356,
]

export const Route = createFileRoute('/_service/modeling/')({
  component: () => (
    <>
      <Head
        title="Modeling Digitals Photography"
        description="Professional modeling digitals photography in Brooklyn. High-quality comp cards and portfolio shots for models. Packages starting at $175."
        image={GALLERY_IMAGES[0]}
        path="/modeling"
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">Modeling Digitals</h1>
        
        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="Packages">
          <div className="space-y-8">
            <PackageCard
              title="1 look Package"
              price={175}
              duration="1hr"
              details={[
                '1 outfit',
                'Portraits, Half body, Full body, Stylistic poses',
                '15 selects',
                'Up to 3 retouched photos',
                'Photos delivered within 5 days',
              ]}
            />
            <PackageCard
              title="2 look Package"
              price={275}
              duration="1.5hr"
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
  ),
}) 