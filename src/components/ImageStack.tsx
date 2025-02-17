interface ImageStackProps {
  images: string[];
  isVisible: boolean;
  mousePosition: { x: number; y: number } | null;
}

const ImageStack = ({ images, isVisible, mousePosition }: ImageStackProps) => {
  if (!isVisible || !mousePosition) return null;

  return (
    <div 
      className="fixed pointer-events-none"
      style={{ 
        left: `${mousePosition.x + 20}px`,
        top: `${mousePosition.y}px`,
      }}
    >
      <div className="flex flex-col">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="w-[40px] h-[40px] overflow-hidden"
            style={{ marginTop: index === 0 ? '0' : '-1px' }}
          >
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStack; 