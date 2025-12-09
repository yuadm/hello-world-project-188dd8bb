import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting 16th birthday check for all household members...");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Auto-update any children who have already turned 16
    console.log("Step 1: Updating children who have turned 16...");
    const { data: updateResult, error: updateError } = await supabase
      .rpc('update_all_children_now_adults');

    if (updateError) {
      console.error("Error updating children to adults:", updateError);
    } else {
      console.log(`Updated ${updateResult || 0} children to adult status`);
    }

    // Step 2: Get children turning 16 soon (within 90 days) using the fixed RPC function
    console.log("Step 2: Fetching children turning 16 soon...");
    const { data: childrenTurning16, error: fetchError } = await supabase
      .rpc('get_children_turning_16_soon', { days_ahead: 90 });

    if (fetchError) {
      console.error("Error fetching children turning 16:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${childrenTurning16?.length || 0} children turning 16 within 90 days`);

    const notifications = [];
    const reminderDays = [90, 30, 7, 0]; // Send reminders at these intervals

    // Step 3: Process each child and send notifications at key intervals
    for (const child of childrenTurning16 || []) {
      const daysUntil16 = child.days_until_16;
      
      // Check if we should send a reminder (at 90, 30, 7, or 0 days)
      const shouldSendReminder = reminderDays.includes(daysUntil16) && !child.turning_16_notification_sent;
      
      // For day 0 (birthday), always send even if previously notified
      const isBirthday = daysUntil16 === 0;
      
      if (!shouldSendReminder && !isBirthday) {
        console.log(`Skipping ${child.full_name} - not at reminder interval (${daysUntil16} days)`);
        continue;
      }

      // Get parent/employee details based on source type
      let recipientEmail = child.email;
      let recipientName = child.full_name;
      let parentName = "";

      if (child.application_id) {
        const { data: application } = await supabase
          .from('childminder_applications')
          .select('first_name, last_name, email')
          .eq('id', child.application_id)
          .single();

        if (application) {
          recipientEmail = application.email || child.email;
          parentName = `${application.first_name} ${application.last_name}`;
        }
      }

      if (child.employee_id) {
        const { data: employee } = await supabase
          .from('employees')
          .select('first_name, last_name, email')
          .eq('id', child.employee_id)
          .single();

        if (employee) {
          recipientEmail = employee.email || child.email;
          parentName = `${employee.first_name} ${employee.last_name}`;
        }
      }

      if (!recipientEmail) {
        console.error(`No email found for ${child.full_name}`);
        continue;
      }

      // Send the birthday alert
      try {
        console.log(`Sending notification for ${child.full_name} (${daysUntil16} days until 16)`);
        
        const { error: emailError } = await supabase.functions.invoke('send-16th-birthday-alert', {
          body: {
            memberId: child.id,
            childName: child.full_name,
            dateOfBirth: child.date_of_birth,
            daysUntil16: daysUntil16,
            applicantEmail: recipientEmail,
            applicantName: parentName || recipientName,
            applicationId: child.application_id || child.employee_id
          }
        });

        if (emailError) {
          console.error(`Failed to send email for ${child.full_name}:`, emailError);
        } else {
          // Update the notification flag
          await supabase
            .from('compliance_household_members')
            .update({ 
              turning_16_notification_sent: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', child.id);

          notifications.push({
            child: child.full_name,
            daysUntil16: daysUntil16,
            notified: parentName || recipientName,
            sourceType: child.source_type
          });
          
          console.log(`Successfully sent notification for ${child.full_name}`);
        }
      } catch (error) {
        console.error(`Error sending notification for ${child.full_name}:`, error);
      }
    }

    console.log(`Completed: Sent ${notifications.length} birthday notifications`);

    return new Response(
      JSON.stringify({
        success: true,
        childrenUpdatedToAdult: updateResult || 0,
        childrenChecked: childrenTurning16?.length || 0,
        notificationsSent: notifications.length,
        notifications
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in check-all-16th-birthdays:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
