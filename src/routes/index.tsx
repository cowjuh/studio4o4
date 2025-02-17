import { createFileRoute } from "@tanstack/react-router";
import Head from "@components/Head";
import ThreeGallery from "@components/ThreeGallery";
import SectionLink from "@components/SectionLink";

// Import images from each section
import modelingImg1 from "@assets/images/digitals/Leah Digitals0292 1.jpg";
import modelingImg2 from "@assets/images/digitals/Leah Digitals0277 1.jpg";
import modelingImg3 from "@assets/images/digitals/IMG_3450.jpg";

// Collect all images for the 3D gallery
const ALL_IMAGES = [
  modelingImg1,
  modelingImg2,
  modelingImg3,
  "https://picsum.photos/seed/headshots1/800/1200",
  "https://picsum.photos/seed/headshots2/800/1200",
  "https://picsum.photos/seed/headshots3/800/1200",
  "https://picsum.photos/seed/editorial1/800/1200",
  "https://picsum.photos/seed/editorial2/800/1200",
  "https://picsum.photos/seed/editorial3/800/1200",
];

const SECTIONS = [
  {
    title: "Modeling Digitals",
    path: "/modeling",
    services: ["3D", "BRANDING", "PRODUCTION", "SOCIAL"],
    images: [modelingImg1, modelingImg2, modelingImg3],
  },
  {
    title: "Headshots",
    path: "/headshots",
    services: ["3D", "BRANDING", "DIGITAL"],
    images: [
      "https://picsum.photos/seed/headshots1/800/1200",
      "https://picsum.photos/seed/headshots2/800/1200",
      "https://picsum.photos/seed/headshots3/800/1200",
    ],
  },
  {
    title: "Editorial & Fine Art",
    path: "/editorial",
    services: ["ADVERTISING", "BRANDING", "DIGITAL", "STRATEGY"],
    images: [
      "https://picsum.photos/seed/editorial1/800/1200",
      "https://picsum.photos/seed/editorial2/800/1200",
      "https://picsum.photos/seed/editorial3/800/1200",
    ],
  },
];

export const Route = createFileRoute("/")({
  component: () => (
    <div className='flex flex-col h-full p-2 lg:p-0'>
      <Head
        title='4o4.space STUDIO - Photography Studio in Bushwick, Brooklyn'
        description='Professional photography studio in Bushwick specializing in modeling digitals, headshots, and editorial photography.'
        path='/'
      />
      <div className='h-full w-full mx-auto flex gap-2 items-start justify-between'>
        <div className='lg:px-8 px-2 flex-1 h-full flex items-center justify-center border border-black rounded border-dashed'>
          <div className='relative w-full flex items-center justify-center'>
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-10'>
              <div className='w-full max-w-5xl flex justify-between px-8'>
                <span className='text-7xl font-medium'>4o4</span>
                <span className='text-7xl font-medium'>STUDIO</span>
              </div>
            </div>
            <div className='w-full max-w-5xl mx-auto flex items-center justify-center h-full'>
              <div className='w-[40vw] aspect-square max-w-[1000px]'>
                <ThreeGallery images={ALL_IMAGES} />
              </div>
            </div>
          </div>
        </div>
        <div className='basis-1/4 flex flex-col h-full justify-between'>
          <div className='divide-y divide-black/70'>
            {SECTIONS.map((section, index) => (
              <SectionLink
                key={section.path}
                index={index}
                title={section.title}
                path={section.path}
                images={section.images}
              />
            ))}
          </div>
          <div className='space-y-4'>
            <div className='text-sm'>
              Photography studio, installation space, and home.
            </div>
            <div className='divide-y divide-black/70'>
              <SectionLink
                title="About"
                path="/about"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});
