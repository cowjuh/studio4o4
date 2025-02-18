import { Link } from "@tanstack/react-router";

interface SectionLinkProps {
  index?: number;
  title: string;
  path: string;
  images?: string[];
}

const SectionLink = ({ index, title, path, images }: SectionLinkProps) => {
  return (
    <Link to={path} className='block border-black/70 group'>
      <div className='flex w-full flex-col lg:flex-row lg:items-start gap-4 justify-between'>
        <div className='flex flex-col justify-between w-full lg:hover:underline'>
          <h2 className='text-sm lg:group-hover:font-bold'>
            {index !== undefined && `#${index + 1} `}{title}
          </h2>
          {images && (
            <div className='overflow-hidden'>
              <div className='flex overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 transition-all duration-500 ease-in-out lg:group-hover:gap-3'>
                {images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${title} preview ${imgIndex + 1}`}
                    className='h-[40px] w-[40px] min-h-[40px] min-w-[40px] object-cover transition-all lg:group-hover:blur-sm'
                    style={{
                      transitionDelay: `${imgIndex * 50}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SectionLink; 