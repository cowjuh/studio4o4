import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '@components/ImageGallery'
import PackageCard from '@components/PackageCard'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import BookingSection from '@components/BookingSection'
import LocationSection from '@components/LocationSection'
import CancellationSection from '@components/CancellationSection'

const imageModules = import.meta.glob('@assets/images/headshots/*.{png,jpg,jpeg}', { eager: true })
const GALLERY_IMAGES = Object.values(imageModules).map(module => (module as { default: string }).default)

export const Route = createFileRoute('/_service/headshots/')({
  component: () => (
    <>
      <Head
        title="Professional Headshot Photography"
        description="Professional headshot photography in Brooklyn. Perfect for LinkedIn, corporate profiles, and acting portfolios. Natural lighting and expert direction."
        image={GALLERY_IMAGES[0]}
        path="/headshots"
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">Headshots</h1>
        
        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="Packages">
          <div className="space-y-8">
            <PackageCard
              title="Basic Package"
              price={200}
              duration="1hr"
              details={[
                '2 looks',
                'Professional headshots optimized for LinkedIn/corporate use',
                '10 selects',
                'Up to 3 retouched photos',
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