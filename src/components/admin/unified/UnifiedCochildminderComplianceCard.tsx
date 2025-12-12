import { useState, useEffect } from "react";
import { AppleCard } from "@/components/admin/AppleCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Download, Plus, Trash2, ChevronDown, FileCheck, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TrafficLightIndicator } from "@/components/admin/application-detail/TrafficLightIndicator";
import { DualTrafficLightIndicator } from "@/components/admin/application-detail/DualTrafficLightIndicator";
import { SendCochildminderFormModal } from "@/components/admin/SendCochildminderFormModal";
import { format, differenceInDays } from "date-fns";

interface Cochildminder {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string | null;
  phone: string | null;
  dbs_status: string;
  dbs_certificate_number: string | null;
  dbs_certificate_date: string | null;
  dbs_certificate_expiry_date: string | null;
  form_token: string | null;
  form_status: string | null;
  form_submitted_date: string | null;
  notes: string | null;
  compliance_status: string | null;
}

interface CochildminderFormData {
  id: string;
  form_token: string;
  cochildminder_id: string;
  status: string | null;
  submitted_at: string | null;
}

interface UnifiedCochildminderComplianceCardProps {
  parentId: string;
  parentType: 'application' | 'employee';
  parentEmail: string;
  parentName: string;
}

export const UnifiedCochildminderComplianceCard = ({
  parentId,
  parentType,
  parentEmail,
  parentName,
}: UnifiedCochildminderComplianceCardProps) => {
  const [cochildminders, setCochildminders] = useState<Cochildminder[]>([]);
  const [forms, setForms] = useState<Map<string, CochildminderFormData>>(new Map());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Modal states
  const [showSendFormModal, setShowSendFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRecordCertModal, setShowRecordCertModal] = useState(false);
  const [showDBSModal, setShowDBSModal] = useState(false);
  const [selectedCochildminder, setSelectedCochildminder] = useState<Cochildminder | null>(null);

  useEffect(() => {
    loadCochildminders();
  }, [parentId, parentType]);

  const loadCochildminders = async () => {
    try {
      const query = supabase
        .from("compliance_cochildminders")
        .select("*")
        .order("first_name");

      if (parentType === 'application') {
        query.eq("application_id", parentId);
      } else {
        query.eq("employee_id", parentId);
      }

      const { data: cochildmindersData, error: cochildmindersError } = await query;
      if (cochildmindersError) throw cochildmindersError;

      // Query cochildminder_applications for submitted forms
      const formsQuery = supabase
        .from("cochildminder_applications")
        .select("*")
        .eq("status", "submitted");

      if (parentType === 'application') {
        formsQuery.eq("application_id", parentId);
      } else {
        formsQuery.eq("employee_id", parentId);
      }

      const { data: formsData, error: formsError } = await formsQuery;
      if (formsError) throw formsError;

      const formsMap = new Map(formsData?.map((f) => [f.cochildminder_id, f]) || []);

      setCochildminders(cochildmindersData || []);
      setForms(formsMap);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load co-childminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrafficLightStatus = (cc: Cochildminder): "compliant" | "pending" | "critical" | "not_applicable" => {
    if (cc.dbs_status === "received" && cc.dbs_certificate_expiry_date) {
      const daysUntilExpiry = differenceInDays(new Date(cc.dbs_certificate_expiry_date), new Date());
      if (daysUntilExpiry < 0) return "critical";
      if (daysUntilExpiry < 30) return "pending";
      return "compliant";
    }

    if (cc.dbs_status === "requested") return "pending";
    return "critical";
  };

  const getFormStatus = (cc: Cochildminder, hasForm: boolean): "compliant" | "pending" | "critical" => {
    if (hasForm) return "compliant";
    if (cc.form_status === "sent" || cc.form_token) return "pending";
    return "critical";
  };

  const getDBSStatus = (cc: Cochildminder): "compliant" | "pending" | "critical" => {
    if (cc.dbs_status === "received" && cc.dbs_certificate_expiry_date) {
      const daysUntilExpiry = differenceInDays(new Date(cc.dbs_certificate_expiry_date), new Date());
      if (daysUntilExpiry < 0) return "critical";
      if (daysUntilExpiry < 30) return "pending";
      return "compliant";
    }
    if (cc.dbs_status === "requested") return "pending";
    return "critical";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      compliant: { variant: "default", label: "Compliant" },
      pending: { variant: "secondary", label: "Pending" },
      critical: { variant: "destructive", label: "Critical" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleRecordCertificate = async (certNumber: string, certDate: string) => {
    if (!selectedCochildminder) return;

    try {
      const expiryDate = new Date(certDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 3);

      const { error } = await supabase
        .from("compliance_cochildminders")
        .update({
          dbs_status: "received",
          dbs_certificate_number: certNumber,
          dbs_certificate_date: certDate,
          dbs_certificate_expiry_date: expiryDate.toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCochildminder.id);

      if (error) throw error;

      toast({
        title: "Certificate Recorded",
        description: `DBS certificate recorded for ${selectedCochildminder.first_name} ${selectedCochildminder.last_name}`,
      });

      loadCochildminders();
      setShowRecordCertModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to record certificate",
        variant: "destructive",
      });
    }
  };

  const handleRequestDBS = async () => {
    if (!selectedCochildminder) return;

    try {
      const { error } = await supabase
        .from("compliance_cochildminders")
        .update({
          dbs_status: "requested",
          dbs_request_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCochildminder.id);

      if (error) throw error;

      toast({
        title: "DBS Requested",
        description: `DBS check requested for ${selectedCochildminder.first_name} ${selectedCochildminder.last_name}`,
      });

      loadCochildminders();
      setShowDBSModal(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to request DBS",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCochildminder = async () => {
    if (!selectedCochildminder) return;

    try {
      const { error } = await supabase
        .from("compliance_cochildminders")
        .delete()
        .eq("id", selectedCochildminder.id);

      if (error) throw error;

      toast({
        title: "Co-childminder Deleted",
        description: `${selectedCochildminder.first_name} ${selectedCochildminder.last_name} has been removed.`,
      });

      loadCochildminders();
      setShowDeleteDialog(false);
      setSelectedCochildminder(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete co-childminder",
        variant: "destructive",
      });
    }
  };

  const getStatusCounts = () => {
    let compliant = 0;
    let pending = 0;
    let critical = 0;

    cochildminders.forEach((cc) => {
      const status = getTrafficLightStatus(cc);
      if (status === "compliant") compliant++;
      else if (status === "pending") pending++;
      else if (status === "critical") critical++;
    });

    return { compliant, pending, critical };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <AppleCard className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </AppleCard>
    );
  }

  return (
    <>
      <AppleCard className="p-6">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight mb-1 flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-600" />
                Co-childminders
              </h2>
              <p className="text-sm text-muted-foreground">
                {cochildminders.length} co-childminder{cochildminders.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              {counts.compliant > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  {counts.compliant} Compliant
                </span>
              )}
              {counts.pending > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  {counts.pending} Pending
                </span>
              )}
              {counts.critical > 0 && (
                <span className="inline-flex items-center gap-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  {counts.critical} Critical
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {cochildminders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              No co-childminders found.
            </div>
          ) : (
            cochildminders.map((cc) => {
              const status = getTrafficLightStatus(cc);
              const hasForm = forms.has(cc.id);

              return (
                <div key={cc.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <TrafficLightIndicator status={status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{cc.first_name} {cc.last_name}</span>
                          {getStatusBadge(status)}
                        </div>
                        <DualTrafficLightIndicator 
                          formStatus={getFormStatus(cc, hasForm)}
                          dbsStatus={getDBSStatus(cc)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-2 text-sm">
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <span className="text-muted-foreground">Email:</span> {cc.email || "Not provided"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span> {cc.phone || "Not provided"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">DOB:</span> {format(new Date(cc.date_of_birth), "dd/MM/yyyy")}
                      </div>
                      <div>
                        <span className="text-muted-foreground">DBS Status:</span> {cc.dbs_status?.replace("_", " ") || "not requested"}
                      </div>
                      {cc.dbs_certificate_number && (
                        <div>
                          <span className="text-muted-foreground">Certificate:</span> {cc.dbs_certificate_number}
                        </div>
                      )}
                    </div>
                    {cc.notes && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <span className="font-medium">Notes:</span> {cc.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {parentType === 'employee' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedCochildminder(cc);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}

                    {/* Form Button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          {hasForm ? (
                            <><Download className="h-4 w-4" /> Download PDF</>
                          ) : (
                            <><Mail className="h-4 w-4" /> Send Form</>
                          )}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-popover">
                        {hasForm ? (
                          <>
                            <DropdownMenuItem onClick={() => {
                              toast({ title: "Coming soon", description: "PDF download will be available soon" });
                            }}>
                              <Download className="h-4 w-4 mr-2" /> Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedCochildminder(cc);
                              setShowSendFormModal(true);
                            }}>
                              <Mail className="h-4 w-4 mr-2" /> Resend Form
                            </DropdownMenuItem>
                          </>
                        ) : (
                          <DropdownMenuItem onClick={() => {
                            setSelectedCochildminder(cc);
                            setShowSendFormModal(true);
                          }}>
                            <Mail className="h-4 w-4 mr-2" /> Send Form
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* DBS Button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileCheck className="h-4 w-4" />
                          {cc.dbs_status === "received" ? "DBS Recorded" : "DBS Actions"}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="bg-popover">
                        {cc.dbs_status !== "requested" && cc.dbs_status !== "received" && (
                          <DropdownMenuItem onClick={() => {
                            setSelectedCochildminder(cc);
                            handleRequestDBS();
                          }}>
                            <Mail className="h-4 w-4 mr-2" /> Request DBS
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => {
                          setSelectedCochildminder(cc);
                          setShowRecordCertModal(true);
                        }}>
                          <FileCheck className="h-4 w-4 mr-2" /> Record Certificate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AppleCard>

      {/* Send Form Modal */}
      <SendCochildminderFormModal
        open={showSendFormModal}
        onOpenChange={setShowSendFormModal}
        cochildminder={selectedCochildminder}
        applicantEmail={parentEmail}
        applicantName={parentName}
        applicationId={parentType === 'application' ? parentId : undefined}
        employeeId={parentType === 'employee' ? parentId : undefined}
        onSuccess={loadCochildminders}
      />

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Co-childminder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCochildminder?.first_name} {selectedCochildminder?.last_name}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCochildminder} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Record Certificate Modal */}
      <AlertDialog open={showRecordCertModal} onOpenChange={setShowRecordCertModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record DBS Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the DBS certificate details for {selectedCochildminder?.first_name} {selectedCochildminder?.last_name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleRecordCertificate(
              formData.get('certNumber') as string,
              formData.get('certDate') as string
            );
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Number</label>
                <input 
                  name="certNumber" 
                  type="text" 
                  required 
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter certificate number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Certificate Date</label>
                <input 
                  name="certDate" 
                  type="date" 
                  required 
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Record Certificate</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
