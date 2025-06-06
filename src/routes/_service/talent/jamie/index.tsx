import { createFileRoute } from '@tanstack/react-router'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import PreviewImage from '@components/PreviewImage'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

type ImageModule = { default: string }

// Import all Jamie's images using Vite's dynamic import
const imageModules = {
  headshot: import.meta.glob<ImageModule>('@assets/images/talent/jamie/main.jpg', { eager: true }),
  digitals: import.meta.glob<ImageModule>('@assets/images/talent/jamie/digitals/*.{png,jpg,jpeg}', { eager: true }),
  editorial: import.meta.glob<ImageModule>('@assets/images/talent/jamie/editorial/*.{png,jpg,jpeg}', { eager: true })
}

// Jamie's image data
const JAMIE_IMAGES = {
  headshot: Object.values(imageModules.headshot)[0].default,
  digitals: [
    {
      image: Object.values(imageModules.digitals)[0].default,
      label: 'Front'
    },
    {
      image: Object.values(imageModules.digitals)[1].default,
      label: 'Side'
    },
    {
      image: Object.values(imageModules.digitals)[2].default,
      label: 'Upper Body'
    },
    {
      image: Object.values(imageModules.digitals)[3].default,
      label: 'Full Body'
    }
  ],
  editorial: Object.values(imageModules.editorial).map((module: ImageModule, index) => ({
    image: module.default,
    label: `Editorial ${index + 1}`
  }))
}

const MeasurementItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium">{label}</span>
    <span className="text-sm text-gray-600">{value}</span>
  </div>
)

const JamiePage = () => {
  return (
    <>
      <Head
        title="Jamie"
        description="Jamie is a model and artist based in New York"
        image={JAMIE_IMAGES.headshot}
        path="/talent/jamie"
      />
      <PreviewImage 
        title="Jamie"
        backgroundImage={JAMIE_IMAGES.headshot}
        onPreviewGenerated={() => {}}
      />
      <div className="lg:px-8 px-2 py-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-medium">Jamie</h1>
            <p className="text-sm text-gray-600 mt-1">Artist / Model</p>
          </div>

          <PhotoProvider>
            {/* Headshot Section */}
            <PageSection title="Headshot">
              <div className="aspect-[3/4] w-full max-w-md cursor-pointer transition-opacity hover:opacity-95">
                <PhotoView src={JAMIE_IMAGES.headshot}>
                  <img 
                    src={JAMIE_IMAGES.headshot} 
                    alt="Jamie"
                    className="w-full h-full object-cover"
                  />
                </PhotoView>
              </div>
            </PageSection>

            {/* Digitals Section */}
            <PageSection title="Digitals">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {JAMIE_IMAGES.digitals.map((digital, index) => (
                  <div key={index}>
                    <div className="aspect-[3/4] w-full cursor-pointer transition-opacity hover:opacity-95">
                      <PhotoView src={digital.image}>
                        <img 
                          src={digital.image} 
                          alt={`Jamie - ${digital.label}`}
                          className="w-full h-full object-cover"
                        />
                      </PhotoView>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{digital.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PageSection>

            {/* Editorial Section */}
            <PageSection title="Editorial">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {JAMIE_IMAGES.editorial.map((image, index) => (
                  <div key={index}>
                    <div className="aspect-[3/4] w-full cursor-pointer transition-opacity hover:opacity-95">
                      <PhotoView src={image.image}>
                        <img 
                          src={image.image} 
                          alt="Jamie"
                          className="w-full h-full object-cover"
                        />
                      </PhotoView>
                    </div>
                  </div>
                ))}
              </div>
            </PageSection>
          </PhotoProvider>

          <PageSection title="About">
            <p className="text-sm">
            Jamie is a model and artist based in New York. Drawing from her Kyrgyz roots and passion for fashion, writing, and film, she creates work that explores identity and storytelling across different mediums.
            </p>
          </PageSection>

          <PageSection title="Measurements">
            <div className="space-y-2">
              <MeasurementItem label="Height" value={'5\'6"'} />
              <MeasurementItem label="Bust" value="33A" />
              <MeasurementItem label="Waist" value={'26"'} />
              <MeasurementItem label="Hips" value={'35"'} />
            </div>
          </PageSection>

          <PageSection title="Contact">
            <div className="space-y-4">
              <p className="text-sm">
                For inquiries: DM <span className="font-medium">@4o4.space</span> on Instagram or email <span className="font-medium">hello@4o4.space</span>
              </p>
            </div>
          </PageSection>
        </div>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_service/talent/jamie/')({
  component: JamiePage,
}) 