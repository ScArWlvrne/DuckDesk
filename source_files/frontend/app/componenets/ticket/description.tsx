function Paragraph({description}: {description: string}) {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start leading-[0] not-italic relative shrink-0 w-full" data-name="Paragraph">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-[24px] text-black tracking-[-0.48px] w-full">
        <p className="leading-[1.2]">Description</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[18px] text-[rgba(0,0,0,0.55)] tracking-[-0.09px] w-full">
        <p className="leading-[1.45]">{description}</p>
      </div>
    </div>
  );
}

function Wrapper({description}: {description: string}   ) {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[48px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Wrapper">
      <Paragraph description={description} />
    </div>
  );
}

export default function TextBlock({description}: {description: string}) {
  return (
    <section className="relative size-full" data-name="Text block 1">
      <div className="flex flex-row justify-center size-full">
        <div className="box-border content-stretch flex items-start justify-center px-[240px] py-[44px] relative size-full">
          <Wrapper description={description} />
        </div>
      </div>
    </section>
  );
}