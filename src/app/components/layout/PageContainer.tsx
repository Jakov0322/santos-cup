type PageContainerProps = {
  children: React.ReactNode;
};

export function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <section className="space-y-5 pt-5">
      {children}
    </section>
  );
}