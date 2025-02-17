interface ImageGalleryProps {
  images: string[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          className="h-[400px] w-auto object-cover"
        />
      ))}
    </div>
  );
};

export default ImageGallery; 