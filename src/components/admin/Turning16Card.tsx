import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppleCard } from "./AppleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, User, Mail, Send, ChevronDown, ChevronUp, Check, Cake } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ChildTurning16 {
  id: string;
  application_id: string | null;
  employee_id: string | null;
  full_name: string;
  date_of_birth: string;
  current_age: number;
  days_until_16: number;
  turns_16_on: string;
  email: string | null;
  relationship: string | null;
  dbs_status: string;
  turning_16_notification_sent: boolean;
  source_type: string;
  parent_name?: string;
}

export const Turning16Card = () => {
  const [children, setChildren] = useState<ChildTurning16[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  useEffect(() => {
    loadChildrenTurning16();
  }, []);

  const loadChildrenTurning16 = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_children_turning_16_soon', { days_ahead: 90 });

      if (error) throw error;

      const enrichedData = await Promise.all((data || []).map(async (child: ChildTurning16) => {
        let parentName = "";
        
        if (child.application_id) {
          const { data: app } = await supabase
            .from('childminder_applications')
            .select('first_name, last_name')
            .eq('id', child.application_id)
            .single();
          if (app) parentName = `${app.first_name} ${app.last_name}`;
        }
        
        if (child.employee_id) {
          const { data: emp } = await supabase
            .from('employees')
            .select('first_name, last_name')
            .eq('id', child.employee_id)
            .single();
          if (emp) parentName = `${emp.first_name} ${emp.last_name}`;
        }

        return { ...child, parent_name: parentName };
      }));

      setChildren(enrichedData);
    } catch (error) {
      console.error("Error loading children turning 16:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (child: ChildTurning16) => {
    setSendingReminder(child.id);
    try {
      const { error } = await supabase.functions.invoke('send-16th-birthday-alert', {
        body: {
          memberId: child.id,
          childName: child.full_name,
          dateOfBirth: child.date_of_birth,
          daysUntil16: child.days_until_16,
          applicantEmail: child.email,
          applicantName: child.parent_name || child.full_name,
          applicationId: child.application_id || child.employee_id
        }
      });

      if (error) throw error;

      setChildren(prev => prev.map(c => 
        c.id === child.id ? { ...c, turning_16_notification_sent: true } : c
      ));

      toast.success(`Reminder sent for ${child.full_name}`);
    } catch (error) {
      console.error("Error sending reminder:", error);
      toast.error("Failed to send reminder");
    } finally {
      setSendingReminder(null);
    }
  };

  const getUrgencyConfig = (daysUntil: number) => {
    if (daysUntil <= 0) return { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", badge: "destructive" as const, label: "Overdue" };
    if (daysUntil <= 7) return { bg: "bg-destructive/10 border-destructive/20", text: "text-destructive", badge: "destructive" as const, label: `${daysUntil}d` };
    if (daysUntil <= 30) return { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-600", badge: "secondary" as const, label: `${daysUntil}d` };
    return { bg: "bg-muted/50 border-border", text: "text-muted-foreground", badge: "outline" as const, label: `${daysUntil}d` };
  };

  const criticalCount = children.filter(c => c.days_until_16 <= 7).length;
  const displayChildren = expanded ? children : children.slice(0, 5);

  if (loading) {
    return (
      <AppleCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cake className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Children Turning 16</h3>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </AppleCard>
    );
  }

  return (
    <AppleCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Cake className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Children Turning 16</h3>
        </div>
        {children.length > 0 && (
          <Badge variant={criticalCount > 0 ? "destructive" : "secondary"}>
            {children.length} upcoming
          </Badge>
        )}
      </div>

      {children.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No children turning 16 in the next 90 days</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayChildren.map((child) => {
            const urgency = getUrgencyConfig(child.days_until_16);
            
            return (
              <div 
                key={child.id} 
                className={`p-4 rounded-xl border ${urgency.bg} transition-all`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{child.full_name}</h4>
                      <Badge variant={urgency.badge} className="shrink-0 text-xs">
                        {urgency.label}
                      </Badge>
                      {child.turning_16_notification_sent && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Notified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        <span className="truncate">{child.parent_name || "Unknown parent"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        <span>16 on {format(new Date(child.turns_16_on), "dd MMM yyyy")}</span>
                      </div>
                      {child.email && (
                        <div className="flex items-center gap-1.5 col-span-2">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{child.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={child.turning_16_notification_sent ? "outline" : "default"}
                    onClick={() => sendReminder(child)}
                    disabled={sendingReminder === child.id}
                    className="shrink-0"
                  >
                    {sendingReminder === child.id ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-1" />
                        {child.turning_16_notification_sent ? "Resend" : "Notify"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
          
          {children.length > 5 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  Show All ({children.length - 5} more)
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </AppleCard>
  );
};
