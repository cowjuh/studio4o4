interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="-mx-4 md:mx-0 flex gap-4 overflow-x-auto pb-4">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          className="h-[60vh] border border-gray-200 w-auto object-cover first:ml-4 md:first:ml-0 last:mr-4 md:last:mr-0"
        />
      ))}
    </div>
  );
};

export default ImageGallery; 