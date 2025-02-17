import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import Head from '../components/Head'
import ThreeGallery from '../components/ThreeGallery'

// Import images from each section
import modelingImg1 from '../assets/images/digitals/Leah Digitals0292 1.jpg'
import modelingImg2 from '../assets/images/digitals/Leah Digitals0277 1.jpg'
import modelingImg3 from '../assets/images/digitals/IMG_3450.jpg'

// Collect all images for the 3D gallery
const ALL_IMAGES = [
  modelingImg1,
  modelingImg2,
  modelingImg3,
  'https://picsum.photos/seed/headshots1/800/1200',
  'https://picsum.photos/seed/headshots2/800/1200',
  'https://picsum.photos/seed/headshots3/800/1200',
  'https://picsum.photos/seed/editorial1/800/1200',
  'https://picsum.photos/seed/editorial2/800/1200',
  'https://picsum.photos/seed/editorial3/800/1200',
]

const SECTIONS = [
  {
    title: 'Modeling Digitals',
    path: '/modeling',
    services: ['3D', 'BRANDING', 'PRODUCTION', 'SOCIAL'],
    images: [modelingImg1, modelingImg2, modelingImg3],
  },
  {
    title: 'Headshots',
    path: '/headshots',
    services: ['3D', 'BRANDING', 'DIGITAL'],
    images: [
      'https://picsum.photos/seed/headshots1/800/1200',
      'https://picsum.photos/seed/headshots2/800/1200',
      'https://picsum.photos/seed/headshots3/800/1200',
    ],
  },
  {
    title: 'Editorial & Fine Art',
    path: '/editorial',
    services: ['ADVERTISING', 'BRANDING', 'DIGITAL', 'STRATEGY'],
    images: [
      'https://picsum.photos/seed/editorial1/800/1200',
      'https://picsum.photos/seed/editorial2/800/1200',
      'https://picsum.photos/seed/editorial3/800/1200',
    ],
  },
]

export const Route = createFileRoute('/')({
  component: () => (
    <>
      <Head
        title="4o4.space STUDIO - Photography Studio in Bushwick, Brooklyn"
        description="Professional photography studio in Bushwick specializing in modeling digitals, headshots, and editorial photography."
        path="/"
      />
      <div className="min-h-screen">
        <div className="lg:px-8 px-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-full flex justify-between px-16">
                <span className="text-4xl font-medium">4o4</span>
                <span className="text-4xl font-medium">STUDIO</span>
              </div>
            </div>
            <div className="w-full aspect-[16/9]">
              <ThreeGallery images={ALL_IMAGES} />
            </div>
          </div>
        </div>
        <div className="divide-y divide-black/70">
          {SECTIONS.map((section) => (
            <Link
              key={section.path}
              to={section.path}
              className="block border-black/70 group"
            >
              <div className="py-4 lg:py-6">
                <div className="flex w-full flex-col lg:flex-row lg:items-start gap-4 justify-between">
                  <div className="flex-shrink-0 lg:w-[240px]">
                    <h2 className="text-xl font-medium mb-2">{section.title}</h2>
                    <div className="flex flex-wrap gap-2">
                      {section.services.map((service) => (
                        <span key={service} className="text-xs text-neutral-600">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
                      {section.images.map((image, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={image}
                          alt={`${section.title} preview ${imgIndex + 1}`}
                          className="h-[200px] w-[200px] min-h-[10vh] min-w-[10vh] object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  ),
}) 