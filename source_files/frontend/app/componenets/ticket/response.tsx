function Text() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Wanda Wingleton</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Lepidopterist at Butterflai</p>
      </div>
    </div>
  );
}

function Author() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Author">
      <Text />
    </div>
  );
}

function Header() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0 w-full" data-name="Header">
      <Author />
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[32px] relative w-full">
          <Header />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black tracking-[-0.09px] w-full">
            <p className="leading-[1.45]">{`I was completely taken by the exceptional naming power and attention to detail from this service. I wanted to find a way to get attention for my creatures of great wonder and beauty in this world’s great garden, and Namedly delivered. `}</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Re: Wanda Wingleton</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Lepidopterist at Butterflai</p>
      </div>
    </div>
  );
}

function Author1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-[1088px]" data-name="Author">
      <Text1 />
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0" data-name="Header">
      <Author1 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[24px] items-start p-[32px] relative w-full">
          <Header1 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[18px] text-black tracking-[-0.09px] w-[min-content]">
            <p className="leading-[1.45]">{`I was completely taken by the exceptional naming power and attention to detail from this service. I wanted to find a way to get attention for my creatures of great wonder and beauty in this world’s great garden, and Namedly delivered. `}</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Frame() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start pl-[80px] pr-0 py-0 relative w-full">
          <Card1 />
        </div>
      </div>
    </div>
  );
}

export default function Chain() {
  return (
    <section className="relative size-full" data-name="Testimonial 1">
      <div className="flex flex-col justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start justify-center px-[64px] py-[48px] relative size-full">
          <Card />
          <Frame />
        </div>
      </div>
    </section>
  );
}