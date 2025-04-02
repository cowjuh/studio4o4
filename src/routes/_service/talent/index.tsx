import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import PageSection from '@components/PageSection'
import Head from '@components/Head'
import PreviewImage from '@components/PreviewImage'

// Placeholder data - replace with actual talent info later
const TALENT_DATA = [
  {
    image: 'https://placehold.co/800x800?text=Talent+1',
    name: 'Leah',
    talents: ['Modeling', 'Content', 'Acting']
  },
  {
    image: 'https://placehold.co/800x800?text=Talent+2',
    name: 'Sarah',
    talents: ['Photography', 'Directing']
  },
  {
    image: 'https://placehold.co/800x800?text=Talent+3',
    name: 'Michael',
    talents: ['Acting', 'Modeling']
  }
]

const TalentPage = () => {
  const [previewImage, setPreviewImage] = useState(TALENT_DATA[0].image)

  return (
    <>
      <Head
        title="Talent & Friends"
        description="A collection of friends and talent that I love and support."
        image={previewImage}
        path="/talent"
      />
      <PreviewImage 
        title="Talent"
        backgroundImage={TALENT_DATA[0].image}
        onPreviewGenerated={setPreviewImage}
      />
      <div className="lg:px-8 px-2 py-8">
        <h1 className="text-2xl font-medium mb-8">Talent</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {TALENT_DATA.map((talent, index) => (
            <div key={index}>
              <div className="aspect-square w-full">
                <img 
                  src={talent.image} 
                  alt={talent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">{talent.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{talent.talents.join(' / ')}</p>
              </div>
            </div>
          ))}
        </div>

        <PageSection title="Work With Us">
          <div className="space-y-4">
            <p className="text-sm">
              If you've worked with me and would like to be added to this page, please reach out to me.
            </p>
            <p className="text-sm">
              DM <span className="font-medium">@4o4.space</span> on Instagram or email <span className="font-medium">hello@4o4.space</span>
            </p>
          </div>
        </PageSection>
      </div>
    </>
  )
}

export const Route = createFileRoute('/_service/talent/')({
  component: TalentPage,
}) 