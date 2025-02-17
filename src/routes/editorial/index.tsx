import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '../../components/ImageGallery'
import PackageCard from '../../components/PackageCard'
import PageSection from '../../components/PageSection'
import Head from '../../components/Head'
import AcuityBookingButton from '../../components/AcuityBookingButton'

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
      <div className="p-8">
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

        <PageSection title="Booking">
          <div className="space-y-4">
            <AcuityBookingButton className="w-full md:w-auto" />
            <div className="space-y-2">
              <p className="text-sm">
                To book, DM @cowjuh on IG or email bookings@4o4.space
              </p>
              <p className="text-sm">
                Payment via Venmo, Zelle, or Cash
              </p>
            </div>
          </div>
        </PageSection>

        <PageSection title="Location">
          <p className="text-sm">
            The studio is conveniently located in Bushwick, within a 3 minute
            walk of the Morgan Ave L stop. Exact address provided upon booking.
          </p>
        </PageSection>

        <PageSection title="Cancellation, Rescheduling Policy">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Cancellation Policy</h3>
              <p className="text-sm">A 50% deposit is required to book your shoot.</p>
            </div>
            <ul className="text-sm space-y-2">
              <li>Cancellations more than 48 hours before — You'll get your full deposit back</li>
              <li>Cancellations within 48 hours — Deposit is non-refundable</li>
            </ul>
          </div>
        </PageSection>
      </div>
    </>
  ),
}) 