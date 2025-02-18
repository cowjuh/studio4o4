import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '@components/ImageGallery'
import PageSection from '@components/PageSection'
import Head from '@components/Head'

const imageModules = import.meta.glob('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })
const GALLERY_IMAGES = Object.values(imageModules).map(module => (module as { default: string }).default)

export const Route = createFileRoute('/_service/editorial/')({
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

        <PageSection title="Let's Work Together">
          <div className="space-y-4">
            <p className="text-sm">
              For editorial and fine art projects, reach out directly to discuss your vision:
            </p>
            <p className="text-sm">
              DM <span className="font-medium">@cowjuh</span> on Instagram or email <span className="font-medium">bookings@4o4.space</span>
            </p>
          </div>
        </PageSection>
      </div>
    </>
  ),
}) 