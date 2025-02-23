interface PackageCardProps {
  title: string;
  description: string;
  price: number;
  duration: string;
  details: string[];
}

const PackageCard = ({ title, price, duration, details, description }: PackageCardProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">{title} — ${price}</h3>
      <p className="text-sm text-neutral-600">{duration}</p>
      <p className="text-sm text-neutral-600">{description}</p>
      <ul className="text-sm space-y-1">
        {details.map((detail, index) => (
          <li key={index}>{detail}</li>
        ))}
      </ul>
    </div>
  );
};

export default PackageCard; 