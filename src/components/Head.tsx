import { Helmet } from 'react-helmet-async'

interface HeadProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

const DEFAULT_TITLE = '4o4.space STUDIO - Photography Studio in Bushwick, Brooklyn';
const DEFAULT_DESCRIPTION = 'Professional photography studio in Bushwick, Brooklyn specializing in modeling digitals, headshots, and editorial photography. Book your session today.';
const DEFAULT_IMAGE = 'https://picsum.photos/1200/630'; // Replace with your actual default OG image

const Head = ({ 
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = '',
}: HeadProps) => {
  const fullUrl = `https://4o4.space${path}`;
  const fullTitle = title === DEFAULT_TITLE ? title : `${title} | 4o4.space STUDIO`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="keywords" content="photography studio, modeling digitals, headshots, editorial photography, bushwick, brooklyn, nyc photographer" />
      <meta name="author" content="Jenny Zhang" />
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: '4o4.space STUDIO',
          image: image,
          description: description,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Morgan Ave',
            addressLocality: 'Brooklyn',
            addressRegion: 'NY',
            postalCode: '11237',
            addressCountry: 'US'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 40.7064,
            longitude: -73.9333
          },
          url: fullUrl,
          telephone: '',
          priceRange: '$$',
          openingHours: 'By appointment',
          founder: {
            '@type': 'Person',
            name: 'Jenny Zhang'
          }
        })}
      </script>
    </Helmet>
  );
};

export default Head; 