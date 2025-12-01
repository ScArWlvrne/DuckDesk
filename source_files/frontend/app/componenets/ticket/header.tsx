//TODO: add copy functionality to ticket id

function Company({title}: {title: string}) {
  return (
    <div className="basis-0 content-stretch flex gap-[8px] grow items-center min-h-px min-w-px relative shrink-0" data-name="Company">
      <div className="basis-0 flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[24px] text-black tracking-[-0.48px]">
        <p className="leading-[1.45]">{title}</p>
      </div>
    </div>
  );
}

function PrimaryButton({status}: {status: string}) {
  return (
    <div className="bg-[#007030] hover:bg-[#104735] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] relative rounded-[12px] shrink-0 transition-colors" data-name="Primary button">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.08px]">
        <p className="leading-[1.45] whitespace-pre">{status}</p>
      </div>
    </div>
  );
}

function Buttons({ticketId, status}: {ticketId: string, status: string}) {
  return (
    <nav className="box-border content-center flex flex-wrap gap-[24px] items-center p-0 relative shrink-0" data-name="Buttons">
      <div className="flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap tracking-[-0.08px]">
        <p className="leading-[1.45] whitespace-pre">{ticketId}</p>
      </div>
      <PrimaryButton status={status} />
    </nav>
  );
}

export default function Header({title, ticketId, status}: {title: string, ticketId: string, status: string}) {
  return (
    <header className="relative size-full" data-name="Header 1">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between px-[64px] py-[24px] relative size-full">
          <Company title={title} />
          <Buttons ticketId={ticketId} status={status} />
        </div>
      </div>
    </header>
  );
}