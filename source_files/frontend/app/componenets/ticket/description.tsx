function Paragraph({description}: {description: string}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
        Description
      </h2>
      <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
}

export default function TextBlock({description}: {description: string}) {
  return (
    <section className="py-6 sm:py-8">
      <Paragraph description={description} />
    </section>
  );
}