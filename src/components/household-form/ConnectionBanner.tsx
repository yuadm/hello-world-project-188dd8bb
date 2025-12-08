import { cn } from "@/lib/utils";
import { Shield, CheckCircle2 } from "lucide-react";

interface ConnectionBannerProps {
  applicantName?: string;
  applicantAddress?: any;
  memberName?: string;
  className?: string;
}

export function ConnectionBanner({ applicantName, applicantAddress, memberName, className }: ConnectionBannerProps) {
  return (
    <div className={cn(
      "flex gap-4 p-5 rounded-[10px] bg-[#DBEAFE] border-l-4 border-l-[#2563EB] mb-8 no-print",
      className
    )}>
      <Shield className="h-6 w-6 flex-shrink-0 text-[#2563EB]" />
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h4 className="text-[0.9375rem] font-semibold text-[#334155]">
            Connected to Childminder Registration
          </h4>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#059669] text-white text-xs font-semibold rounded-full w-fit">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Secure Link Verified
          </span>
        </div>
        
        <div className="space-y-1.5 text-[0.9375rem] text-[#475569]">
          {applicantName && (
            <p>
              <span className="font-medium text-[#334155]">{applicantName}</span>
              {applicantAddress && (
                <span className="ml-1">
                  — {applicantAddress.line1}, {applicantAddress.town}
                </span>
              )}
            </p>
          )}
          {memberName && (
            <p>
              This form is for: <span className="font-medium text-[#334155]">{memberName}</span>
            </p>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-[#93C5FD]">
          <p className="text-xs text-[#64748B]">
            <strong>Important:</strong> This information is set by the childminder who added you to their application. 
            If it is incorrect, you must ask them to cancel this request and send a new, correct invitation.
          </p>
        </div>
      </div>
    </div>
  );
}
