import type { User } from "../page";
import LogoutButton from "./LogoutButton";

export default function Navigate({ user, newticket }: { user: User; newticket: boolean }) {
  const role = user.role;

  return (
    <div className="absolute bg-white h-[100px] left-0 overflow-clip right-0 top-0 px-8 py-4 z-50" data-name="Navigation">
      <div className="absolute content-stretch flex gap-[16px] items-center justify-end right-[80px] top-[20px]" data-name="Items">
        {/* Show “Co-pilot” badge only for staff */}
        {role === "admin" || role === "advisor" ? (
          <p className="leading-[1.5] whitespace-pre">Co-pilot</p>
        ) : null}
        {/* Only show the New Ticket CTA when not already on the ticket creation page */}
        {!newticket ? (
          <div className="bg-[#007030] box-border content-stretch flex gap-[8px] items-center justify-center px-[24px] py-[14px] relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 hover:bg-[#104735] transition-colors" data-name="Button">
            <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-nowrap text-white">
              <a href="/editTicket" className="leading-[1.5] whitespace-pre">New ticket</a>
            </div>
          </div>
        ) : null}
        <LogoutButton />
      </div>
      <div className="absolute flex flex-col font-['Roboto:Regular',_sans-serif] font-normal h-[60px] justify-center leading-[0] left-[66px] text-[40px] text-[#007030] top-[50px] tracking-[-0.25px] translate-y-[-50%] w-[531px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <a href="/" className="leading-[44px] hover:text-[#104735] transition-colors">University of Oregon</a>
      </div>
    </div>
  );
}
