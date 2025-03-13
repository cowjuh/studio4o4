import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import ImageGallery from "@components/ImageGallery";
import PageSection from "@components/PageSection";
import Head from "@components/Head";
import PreviewImage from "@components/PreviewImage";

const imageModules = import.meta.glob("@assets/images/space/*.{png,jpg,jpeg}", {
  eager: true,
});
const GALLERY_IMAGES = Object.values(imageModules).map(
  (module) => (module as { default: string }).default
);

const SpacePage = () => {
  const [previewImage, setPreviewImage] = useState(GALLERY_IMAGES[0]);

  return (
    <>
      <Head
        title='THE SPACE - Studio 4O4'
        description='A creative photography studio space in Brooklyn. Perfect for photoshoots, small events, and creative collaborations. Natural light, high ceilings, and professional equipment available.'
        image={previewImage}
        path='/space'
      />
      <PreviewImage
        title='THE SPACE'
        backgroundImage={GALLERY_IMAGES[0]}
        onPreviewGenerated={setPreviewImage}
      />
      <div className='lg:px-8 px-2 py-8'>
        <h1 className='text-2xl font-medium mb-8'>THE SPACE</h1>

        <ImageGallery images={GALLERY_IMAGES} />
        <PageSection title='The Space'>
          <div className='space-y-4'>
            <ul className='text-sm'>
              <p>800 sqft</p>
              <p>12ft ceilings</p>
              <p>Bathroom & Kitchen</p>
              <p>3 huge white walls</p>
              <p>1 brick wall</p>
              <p>7AM - 10AM: Direct sunlight</p>
              <p>10AM Onwards: Studio lighting</p>
            </ul>
          </div>
        </PageSection>
        <PageSection title='Furniture'>
          <div className='space-y-4'>
            <ul className='text-sm'>
              <p>4x Tatami Mats</p>
              <p>Assorted bean bags</p>
              <p>Assorted floor lamps</p>
              <p>1x Snow peak couch</p>
              <p>1x Black leather couch</p>
              <p>Professional equipment</p>
              <p>Flexible booking options</p>
            </ul>
          </div>
        </PageSection>

        <PageSection title='Equipment'>
          <div className='space-y-4'>
            <p className="text-sm">I intend on adding more equipment, but for now:</p>
            <ul className='text-sm'>
              <li>9ft wide white seamless backdrop</li>
              <li>9ft wide black seamless backdrop (NEED HELP INSTALLING)</li>
              <li>Godox SL150W II LED Video Light Continuous</li>
              <li>
                Godox Octa Softbox with Bowens Speed Ring and Grid (37.4")
              </li>
              <li>2x Tripods</li>
              <li>1x Light Stand</li>
              <li>1x Projector</li>
              <li>1x Height Adjustable Stool</li>
            </ul>
          </div>
        </PageSection>

        <PageSection title='Use The Space'>
          <div className='space-y-4'>
            <p className='text-sm'>
              For studio inquiries and bookings, please reach out:
            </p>
            <p className='text-sm'>
              DM <span className='font-medium'>@cowjuh</span> on Instagram or
              email <span className='font-medium'>cowjuh@gmail.com</span>
            </p>
          </div>
        </PageSection>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_service/space/")({
  component: SpacePage,
});
