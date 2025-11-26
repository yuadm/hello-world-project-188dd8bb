import { Mail, FileText, Send, Download, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberActionsDropdownProps {
  member: {
    id: string;
    full_name: string;
    dbs_status: string;
    dbs_certificate_number: string | null;
    application_submitted: boolean;
    form_token: string | null;
  };
  onRequestDBS: () => void;
  onRecordCertificate: () => void;
  onSendForm: () => void;
  onDownloadForm: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isChild?: boolean;
}

export const MemberActionsDropdown = ({
  member,
  onRequestDBS,
  onRecordCertificate,
  onSendForm,
  onDownloadForm,
  onEdit,
  onDelete,
  isChild = false,
}: MemberActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background">
        {!isChild && (member.dbs_status === 'not_requested' || member.dbs_status === 'requested') && (
          <DropdownMenuItem onClick={onRequestDBS}>
            <Mail className="h-4 w-4 mr-2" />
            {member.dbs_status === 'requested' ? 'Resend DBS Request' : 'Request DBS'}
          </DropdownMenuItem>
        )}
        
        {!isChild && (
          <DropdownMenuItem onClick={onRecordCertificate}>
            <FileText className="h-4 w-4 mr-2" />
            {member.dbs_certificate_number ? 'Update Certificate' : 'Record Certificate'}
          </DropdownMenuItem>
        )}
        
        {!isChild && <DropdownMenuSeparator />}
        
        {!isChild && member.application_submitted ? (
          <DropdownMenuItem onClick={onDownloadForm}>
            <Download className="h-4 w-4 mr-2" />
            Download Form
          </DropdownMenuItem>
        ) : !isChild ? (
          <DropdownMenuItem onClick={onSendForm}>
            <Send className="h-4 w-4 mr-2" />
            {member.form_token ? 'Resend Form' : 'Send Form'}
          </DropdownMenuItem>
        ) : null}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Details
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
