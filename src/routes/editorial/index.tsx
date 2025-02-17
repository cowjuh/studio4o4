import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '../../components/ImageGallery'
import PackageCard from '../../components/PackageCard'
import PageSection from '../../components/PageSection'
import Head from '../../components/Head'
import BookingSection from '../../components/BookingSection'
import LocationSection from '../../components/LocationSection'
import CancellationSection from '../../components/CancellationSection'

// Placeholder gallery images
const GALLERY_IMAGES = [
  'https://picsum.photos/seed/editorial1/800/1200',
  'https://picsum.photos/seed/editorial2/800/1200',
  'https://picsum.photos/seed/editorial3/800/1200',
  'https://picsum.photos/seed/editorial4/800/1200',
  'https://picsum.photos/seed/editorial5/800/1200',
  'https://picsum.photos/seed/editorial6/800/1200',
]

export const Route = createFileRoute('/editorial/')({
  component: () => (
    <>
      <Head
        title="Editorial & Fine Art Photography"
        description="Creative editorial and fine art photography in Brooklyn. Artistic direction and high-end fashion photography for magazines, portfolios, and personal projects."
        image={GALLERY_IMAGES[0]}
        path="/editorial"
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">Editorial & Fine Art</h1>
        
        <ImageGallery images={GALLERY_IMAGES} />

        <PageSection title="Packages">
          <div className="space-y-8">
            <PackageCard
              title="Editorial Package"
              price={350}
              duration="2hr"
              details={[
                '3 looks',
                'Creative direction included',
                'Full editorial shoot with artistic direction',
                '20 selects',
                'Up to 5 retouched photos',
                'Photos delivered within 7 days',
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