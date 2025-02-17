import { createFileRoute } from '@tanstack/react-router'
import ImageGallery from '../../components/ImageGallery'
import PageSection from '../../components/PageSection'
import Head from '../../components/Head'

// Placeholder gallery images
const GALLERY_IMAGES = [
  'https://picsum.photos/seed/about1/800/1200',
  'https://picsum.photos/seed/about2/800/1200',
  'https://picsum.photos/seed/about3/800/1200',
]

export const Route = createFileRoute('/about/')({
  component: () => (
    <>
      <Head
        title="About Our Photography Studio"
        description="4o4.space STUDIO is a professional photography studio in Bushwick, Brooklyn. Founded by Jenny Zhang, we specialize in modeling digitals, headshots, and editorial photography."
        image={GALLERY_IMAGES[0]}
        path="/about"
      />
      <div className="p-8">
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
  ),
}) 