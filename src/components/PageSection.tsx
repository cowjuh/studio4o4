interface PageSectionProps {
  title: string;
  children: React.ReactNode;
}

const PageSection = ({ title, children }: PageSectionProps) => {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      {children}
    </section>
  );
};

export default PageSection; 