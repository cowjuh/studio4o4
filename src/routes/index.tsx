import { createFileRoute } from "@tanstack/react-router";
import Head from "@components/Head";
import ThreeGallery from "@components/ThreeGallery";

type ImageModule = { default: string }

const modelingImages = import.meta.glob<ImageModule>('@assets/images/digitals/*.{png,jpg,jpeg}', { eager: true })
const headshotsImages = import.meta.glob<ImageModule>('@assets/images/headshots/*.{png,jpg,jpeg}', { eager: true })
const editorialImages = import.meta.glob<ImageModule>('@assets/images/editorial/*.{png,jpg,jpeg}', { eager: true })

const getFirst4Images = (moduleObj: Record<string, ImageModule>) => {
  return Object.values(moduleObj)
    .map(module => module.default)
    .slice(0, 4)
}

const getAllImages = (moduleObj: Record<string, ImageModule>) => {
  return Object.values(moduleObj)
    .map(module => module.default)
}

const ALL_IMAGES = [
  ...getFirst4Images(modelingImages),
  ...getFirst4Images(headshotsImages),
  ...getAllImages(editorialImages),
];

export const Route = createFileRoute("/")({
  component: () => (
    <div className='flex flex-col h-full p-2 lg:p-0'>
      <Head
        title='4o4.space STUDIO - Photography Studio in Bushwick, Brooklyn'
        description='Professional photography studio in Bushwick specializing in modeling digitals, headshots, and editorial photography.'
        path='/'
      />
      <div className='h-full w-full mx-auto flex flex-col lg:flex-row gap-2 items-start justify-between'>
        <div className='lg:px-8 px-2 flex-1 h-full flex items-center justify-center border border-black rounded border-dashed w-full'>
          <div className='relative w-full flex items-center justify-center'>
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-10'>
              <div className='w-full max-w-5xl flex justify-between px-8'>
                <span className='lg:text-7xl text-5xl font-medium'>4o4</span>
                <span className='lg:text-7xl text-5xl font-medium'>STUDIO</span>
              </div>
            </div>
            <div className='w-full max-w-5xl mx-auto flex items-center justify-center h-full'>
              <div className='lg:w-[40vw] w-full aspect-square max-w-[1000px]'>
                <ThreeGallery images={ALL_IMAGES} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
});
