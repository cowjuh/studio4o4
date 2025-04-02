import { createFileRoute } from "@tanstack/react-router";
// import ImageGallery from "@components/ImageGallery";
import PageSection from "@components/PageSection";
import Head from "@components/Head";
import BirdsEyeWave from "@/components/BirdsEyeWave";

// Use the same images as editorial
const imageModules = import.meta.glob(
  "@assets/images/editorial/*.{png,jpg,jpeg}",
  { eager: true }
);
const GALLERY_IMAGES = Object.values(imageModules).map(
  (module) => (module as { default: string }).default
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <h3 className='text-sm font-semibold uppercase tracking-wide mt-8 mb-2'>
    {children}
  </h3>
);

const TextContent = ({ children }: { children: React.ReactNode }) => (
  <p className='text-sm'>{children}</p>
);

const AboutPage = () => {
  return (
    <>
      <Head
        title='4o4 STUDIO'
        description='4o4.space STUDIO is a professional photography studio in Bushwick, Brooklyn. Founded by Jenny Zhang, specializing in modeling digitals, comp cards, headshots, personal branding, and editorial photography.'
        path='/about'
      />
      <div className='lg:px-8 px-2 py-8'>
        <div className='max-w-xl'>
          <div className="h-[40vh] border border-black border-dashed rounded-lg overflow-hidden">
            <BirdsEyeWave images={GALLERY_IMAGES} />
          </div>
          <PageSection>
            <TextContent>
              4o4 STUDIO is Jenny Zhang's photography studio, installation
              gallery, gathering place. A minimally {" "}
              <span className='line-through'>barely</span> furnished space
              located in Bushwick, Brooklyn, NY. Music is always playing here. Come hang out.
            </TextContent>
          </PageSection>
          <PageSection title='Services'>
            <div>
              <SectionHeader>Photography</SectionHeader>
              <TextContent>
                I provide studio photography services, studio rental time, and
                photo editing services.
              </TextContent>
            </div>

            <div>
              <SectionHeader>Everything Else</SectionHeader>
              <TextContent>
                I'm also a software engineer, video editor, illustrator, product designer, graphic designer, and more. I learn fast.
                To work on something together outside of photography, reach out cowjuh (at) gmail (dot) com.
              </TextContent>
            </div>
          </PageSection>
        </div>

        <PageSection title='Contact'>
          <div className='max-w-xl'>
            <TextContent>
              For inquiries: DM @4o4.space on IG or email hello@4o4.space
            </TextContent>
            <TextContent>
              Location: Bushwick, Brooklyn (3 min walk from Morgan Ave L stop)
            </TextContent>
          </div>
        </PageSection>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_service/about/")({
  component: AboutPage,
});
