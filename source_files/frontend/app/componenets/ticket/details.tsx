//TODO: add variables instead of placeholder text
//TODO: import correct file svg for Avatar component


function Text() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 text-[16px] tracking-[-0.08px] w-full" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Responsible</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Staff responsible for ticket</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 2">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center leading-[0] not-italic px-[31px] py-[32px] relative w-full">
          <Text />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">USER NAME</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Text1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Last Modified</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Date and modified by</p>
      </div>
    </div>
  );
}

function Author() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text1 />
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 3">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center p-[32px] relative w-full">
          <Author />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">DATE</p>
          </div>
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">USER NAME</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Column() {
  return (
    <li className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-center min-h-px min-w-px p-0 relative shrink-0" data-name="Column 1">
      <Card />
      <Card1 />
    </li>
  );
}

function Text2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Department</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Department of Requester</p>
      </div>
    </div>
  );
}

function Author1() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text2 />
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 3">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center p-[32px] relative w-full">
          <Author1 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">DEPARTMENT OF USER</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Text3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Requester</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Requester of ticket</p>
      </div>
    </div>
  );
}

function Author2() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text3 />
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 5">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center p-[32px] relative w-full">
          <Author2 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">USER NAME</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Text4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Created</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Date created</p>
      </div>
    </div>
  );
}

function Author3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text4 />
    </div>
  );
}

function Card6() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 5">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center p-[32px] relative w-full">
          <Author3 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">DATE</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Column1() {
  return (
    <li className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-center min-h-px min-w-px p-0 relative shrink-0" data-name="Column 2">
      <Card5 />
      <Card3 />
      <Card6 />
    </li>
  );
}

function Text5() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">{`95 # `}</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Student’s 95 number</p>
      </div>
    </div>
  );
}

function Author4() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text5 />
    </div>
  );
}

function Card2() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 4">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-center p-[32px] relative w-full">
          <Author4 />
          <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-black text-nowrap tracking-[-0.09px]">
            <p className="leading-[1.45] whitespace-pre">951234567</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[2px] grow items-start leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] tracking-[-0.08px]" data-name="Text">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center relative shrink-0 text-black w-full">
        <p className="leading-[1.5]">Files</p>
      </div>
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[rgba(0,0,0,0.55)] w-full">
        <p className="leading-[1.4]">Uploaded files</p>
      </div>
    </div>
  );
}

function Author5() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full" data-name="Author">
      <Text6 />
    </div>
  );
}

function Avatar() {
  return <div className="shrink-0 size-[40px]" data-name="Avatar" />;
}

function Text7() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[4px] grow items-start min-h-px min-w-px relative shrink-0 text-[#1d1b20]" data-name="Text">
      <p className="font-['Roboto:Medium',sans-serif] font-medium leading-[24px] relative shrink-0 text-[16px] tracking-[0.15px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        FILE
      </p>
      <p className="font-['Roboto:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] tracking-[0.25px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Date uploaded
      </p>
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="Content">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
          <Avatar />
          <Text7 />
        </div>
      </div>
    </div>
  );
}

function BuildingBlocksContent() {
  return (
    <div className="content-stretch flex items-center overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Building Blocks/Content">
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <Content />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Card 6">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start p-[32px] relative w-full">
          <Author5 />
          <BuildingBlocksContent />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02),0px_6px_12px_0px_rgba(0,0,0,0.03)]" />
    </div>
  );
}

function Column2() {
  return (
    <li className="basis-0 box-border content-stretch flex flex-col gap-[32px] grow items-center min-h-px min-w-px p-0 relative shrink-0" data-name="Column 3">
      <Card2 />
      <Card4 />
    </li>
  );
}

function Gallery() {
  return (
    <ul className="box-border content-stretch flex gap-[32px] items-start justify-center p-0 relative shrink-0 w-full" data-name="Gallery">
      <Column />
      <Column1 />
      <Column2 />
    </ul>
  );
}

export default function TestimonialWall() {
  return (
    <section className="relative size-full" data-name="Testimonial wall 1">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[64px] items-center justify-center px-[64px] py-[37px] relative size-full">
          <Gallery />
        </div>
      </div>
    </section>
  );
}