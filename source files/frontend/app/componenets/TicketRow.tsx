import { Ticket } from "../page";

function Frame1({ ticket }: { ticket: Ticket }) {
  return (
    <div className="basis-0 content-stretch flex gap-[4px] grow h-[32px] items-center justify-center min-h-px min-w-px relative shrink-0">
      <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-[114px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.id}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[201px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.title}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.requester}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.responsible}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-[200px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.modified}</p>
      </div>
      <div className="content-stretch flex flex-col gap-[8px] h-[32px] items-start relative shrink-0 w-[199px]" data-name="Text Content Heading">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">{ticket.modifiedBy}</p>
      </div>
    </div>
  );
}

function Card({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-white h-[77px] min-w-[240px] relative shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center min-w-inherit size-full">
        <div className="box-border content-stretch flex h-[77px] items-center justify-between min-w-inherit px-[24px] py-0 relative w-full">
          <Frame1 ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
export default function TicketRow({ ticket }: { ticket: Ticket }) {
  return (
    <div className="box-border content-stretch flex flex-col gap-[4px] items-center justify-center px-[0px] py-[8px] relative rounded-[0px] shrink-0 w-full" data-name="Row">
      <Card ticket={ticket} />
    </div>
  );
}