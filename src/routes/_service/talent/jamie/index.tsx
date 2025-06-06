import { createFileRoute } from '@tanstack/react-router'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import PreviewImage from '@components/PreviewImage'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'

// Jamie's image data
const JAMIE_IMAGES = {
  headshot: '/src/assets/images/talent/jamie/main.jpg',
  digitals: [
    {
      image: '/src/assets/images/talent/jamie/digitals/front.jpg',
      label: 'Front'
    },
    {
      image: '/src/assets/images/talent/jamie/digitals/side.jpg',
      label: 'Side'
    },
    {
      image: '/src/assets/images/talent/jamie/digitals/upper-body.jpg',
      label: 'Upper Body'
    },
    {
      image: '/src/assets/images/talent/jamie/digitals/full-body.jpg',
      label: 'Full Body'
    }
  ],
  editorial: [
    {
      image: '/src/assets/images/talent/jamie/editorial/IMG_4623.jpg',
      label: 'Editorial 1'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/IMG_4578.jpg',
      label: 'Editorial 2'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/IMG_4207.jpg',
      label: 'Editorial 3'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/IMG_4186.jpg',
      label: 'Editorial 4'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/EDH_NYCXDESIGN_PHOTOSHOOT-081.jpg',
      label: 'Editorial 5'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/EDH_NYCXDESIGN_PHOTOSHOOT-069.jpg',
      label: 'Editorial 6'
    },
    {
      image: '/src/assets/images/talent/jamie/editorial/20250518_nausicaa_02_look_1378.jpg',
      label: 'Editorial 7'
    }
  ]
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
        title="Jamie Waltzer"
        description="Jamie Waltzer is a model and artist based in New York"
        image={JAMIE_IMAGES.headshot}
        path="/talent/jamie"
      />
      <PreviewImage 
        title="Jamie Waltzer"
        backgroundImage={JAMIE_IMAGES.headshot}
        onPreviewGenerated={() => {}}
      />
      <div className="lg:px-8 px-2 py-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-2xl font-medium">Jamie Waltzer</h1>
            <p className="text-sm text-gray-600 mt-1">Artist / Model</p>
          </div>

          <PhotoProvider>
            {/* Headshot Section */}
            <PageSection title="Headshot">
              <div className="aspect-[3/4] w-full max-w-md cursor-pointer transition-opacity hover:opacity-95">
                <PhotoView src={JAMIE_IMAGES.headshot}>
                  <img 
                    src={JAMIE_IMAGES.headshot} 
                    alt="Jamie Waltzer"
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
                          alt={`Jamie Waltzer - ${digital.label}`}
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
                          alt="Jamie Waltzer"
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
              Jamie Waltzer is a model and artist based in New York.
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