'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitTicket, getDepartments, Department } from "../../lib/api";
// import svgPaths from "./svg-fo56gbn0a8";
// import { imgIcon, imgIcon1, imgIcon2, imgIcon3, imgIcon4, imgDrag, imgIcon5, imgIcon6, imgIcon7, imgIcon8, imgIcon9, img } from "./svg-8g5tp";
type FilePlusProps = {
  className?: string;
  size?: "20" | "24" | "32" | "40" | "48" | "16";
};

/**
 * @figmaAssetKey 43238f604dd9db64f47c3bbdc7ef57b19e6fd2c1
 */
function FilePlus({ className, size = "48" }: FilePlusProps) {
  if (size === "16") {
    return (
      <div className={className} data-name="Size=16">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6%_-7.5%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full"/>
          </div>
        </div>
      </div>
    );
  }
  if (size === "20") {
    return (
      <div className={className} data-name="Size=20">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6%_-7.5%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "24") {
    return (
      <div className={className} data-name="Size=24">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-6.25%_-7.81%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "32") {
    return (
      <div className={className} data-name="Size=32">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-5.63%_-7.03%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  if (size === "40") {
    return (
      <div className={className} data-name="Size=40">
        <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
          <div className="absolute inset-[-5.25%_-6.56%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Size=48">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Icon">
        <div className="absolute inset-[-5%_-6.25%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 44">
            <path id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>
    </div>
  );
}
type TextareaFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  description?: string;
  hasDescription?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  state?: "Default" | "Error" | "Disabled";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey 45a146b674f858a2c626c056c58ddf0f67e192ee
 */
function TextareaField({ className, hasLabel = true, hasError = false, label = "Label", error = "Hint", description = "Description", hasDescription = false, value = "", onChange, state = "Default", valueType = "Default" }: TextareaFieldProps) {
  const isPlaceholder = valueType === "Placeholder" && !value;
  const displayValue = isPlaceholder ? "" : value;
  
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
        <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
          <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
              <textarea
                value={displayValue}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={isPlaceholder ? error : undefined}
                className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full resize-none border-none outline-none bg-transparent"
                style={{ color: isPlaceholder ? '#b3b3b3' : '#1e1e1e' }}
              />
              <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
                <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                    <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-full">{label}</p>}
      <div className="bg-white min-h-[80px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Textarea">
        <div className="min-h-inherit min-w-inherit overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-start min-h-inherit min-w-inherit px-[16px] py-[12px] relative w-full">
            <textarea
              value={displayValue}
              onChange={(e) => onChange?.(e.target.value)}
              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-[1.4] min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full resize-none border-none outline-none bg-transparent"
              style={{ color: '#1e1e1e' }}
            />
            <div className="absolute bottom-[6.02px] right-[5.02px] size-[6.627px]" data-name="Drag">
              <div className="absolute inset-[-5.33%]" style={{ "--stroke-0": "rgba(179, 179, 179, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                  <path id="Drag" stroke="var(--stroke-0, #B3B3B3)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      </div>
    </div>
  );
}
type ChevronDownProps = {
  className?: string;
  size?: "20" | "24" | "32" | "40" | "48" | "16";
};

/**
 * @figmaAssetKey 561ef01d78ee35ec50f6381d0c973b7ff48bf6a9
 */
function ChevronDown({ className, size = "48" }: ChevronDownProps) {
  if (size === "16") {
    return (
      <div className={className} data-name="Size=16">
        <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
          <div className="absolute inset-[-20%_-10%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 6">
              <path d="M0.8 0.8L4.8 4.8L8.8 0.8" id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="Size=48">
      <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]" data-name="Icon">
        <div className="absolute inset-[-16.67%_-8.33%]" style={{ "--stroke-0": "rgba(30, 30, 30, 1)" } as React.CSSProperties}>
          <img alt="" className="block max-w-none size-full" />
        </div>
      </div>
    </div>
  );
}
type SelectFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  open?: boolean;
  description?: string;
  hasDescription?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string | number; label: string }>;
  state?: "Default" | "Error" | "Disabled";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey b4d568282b67de741c52524b83888113e79a662c
 */
function SelectField({ className, hasLabel = true, hasError = false, label = "Label", error = "Error", open = false, description = "Description", hasDescription = false, value = "", onChange, options = [], state = "Default", valueType = "Default" }: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(open);
  const isPlaceholder = valueType === "Placeholder" && !value;
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : (isPlaceholder ? "" : value);
  
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
          <div className="flex flex-row items-center min-w-inherit size-full relative">
            <select
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full h-full pl-[16px] pr-[32px] py-[12px] appearance-none bg-transparent border-none outline-none cursor-pointer"
              style={{ color: isPlaceholder ? '#b3b3b3' : '#1e1e1e' }}
            >
              <option value="" disabled>{isPlaceholder ? error : "Select..."}</option>
              {options.map((opt) => (
                <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px] absolute right-[12px] pointer-events-none" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
      <div className="bg-white h-[40px] min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Select">
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        <div className="flex flex-row items-center min-w-inherit size-full relative">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full h-full pl-[16px] pr-[32px] py-[12px] appearance-none bg-transparent border-none outline-none cursor-pointer"
            style={{ color: '#1e1e1e' }}
          >
            {options.map((opt) => (
              <option key={opt.value} value={String(opt.value)}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size="16" className="overflow-clip relative shrink-0 size-[16px] absolute right-[12px] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
type InputFieldProps = {
  className?: string;
  hasLabel?: boolean;
  hasError?: boolean;
  label?: string;
  error?: string;
  hasDescription?: boolean;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  state?: "Disabled" | "Default" | "Error";
  valueType?: "Default" | "Placeholder";
};

/**
 * @figmaAssetKey c28150b04d333d34ed9d2b77abd9f2f54e1a878a
 */
function InputField({ className, hasLabel = true, hasError = false, label = "Label", error = "Error", hasDescription = false, description = "Description", value = "", onChange, state = "Default", valueType = "Default" }: InputFieldProps) {
  const isPlaceholder = valueType === "Placeholder" && !value;
  
  if (state === "Default" && valueType === "Placeholder") {
    return (
      <div className={className} data-name="State=Default, Value Type=Placeholder">
        {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
        <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
          <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
            <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={isPlaceholder ? error : undefined}
                className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full border-none outline-none bg-transparent"
                style={{ color: isPlaceholder ? '#b3b3b3' : '#1e1e1e' }}
              />
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
        </div>
      </div>
    );
  }
  return (
    <div className={className} data-name="State=Default, Value Type=Default">
      {hasLabel && <p className="font-['Inter:Regular',sans-serif] font-normal leading-[1.4] min-w-full not-italic relative shrink-0 text-[#1e1e1e] text-[16px] w-[min-content]">{label}</p>}
      <div className="bg-white min-w-[240px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
        <div className="flex flex-row items-center min-w-inherit overflow-clip rounded-[inherit] size-full">
          <div className="box-border content-stretch flex items-center min-w-inherit px-[16px] py-[12px] relative w-full">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              className="basis-0 font-['Inter:Regular',sans-serif] font-normal grow leading-none min-h-px min-w-px not-italic relative shrink-0 text-[16px] w-full border-none outline-none bg-transparent"
              style={{ color: '#1e1e1e' }}
            />
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px]" />
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Legend">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#1e1e1e] text-[24px] tracking-[-0.48px] w-full">Create New Ticket</p>
    </div>
  );
}

export default function EditForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!subject.trim() || !message.trim() || !department) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await submitTicket({
        department: Number(department),
        subject: subject.trim(),
        message: message.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push(`/ticket?id=${result.ticket.ticket_id}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = departments.map(d => ({
    value: d.department_id,
    label: d.name
  }));

  return (
    <div className="bg-white relative rounded-[8px] size-full" data-name="Form Shipping">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <form onSubmit={handleSubmit} className="box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative size-full">
          <Legend />
          <InputField 
            label="Subject" 
            value={subject} 
            onChange={setSubject}
            valueType="Placeholder" 
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" 
          />
          <SelectField 
            label="Department" 
            value={department}
            onChange={setDepartment}
            options={departmentOptions}
            valueType="Placeholder"
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" 
          />
          <TextareaField 
            label="Description" 
            value={message} 
            onChange={setMessage}
            valueType="Placeholder" 
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" 
          />
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-sm">Ticket created successfully! Redirecting...</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="box-border content-stretch cursor-pointer flex gap-[16px] items-center overflow-visible p-0 relative shrink-0 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            data-name="Button Group"
          >
            <div className="basis-0 bg-[#007030] hover:bg-[#104735] grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-colors" data-name="Button">
              <div className="flex flex-row items-center justify-center overflow-clip rounded-[inherit] size-full">
                <div className="box-border content-stretch flex gap-[8px] items-center justify-center p-[12px] relative w-full">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-none not-italic relative shrink-0 text-[16px] text-white text-nowrap whitespace-pre">
                    {loading ? "Submitting..." : "Submit Ticket"}
                  </p>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#007030] border-solid inset-0 pointer-events-none rounded-[8px]" />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
