import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const requestApplicantDBSSchema = z.object({
  applicantEmail: z.string().email("Please enter a valid email address"),
});

type RequestApplicantDBSFormData = z.infer<typeof requestApplicantDBSSchema>;

interface RequestApplicantDBSModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  onSuccess: () => void;
}

export function RequestApplicantDBSModal({
  open,
  onOpenChange,
  applicationId,
  applicantName,
  applicantEmail,
  onSuccess,
}: RequestApplicantDBSModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RequestApplicantDBSFormData>({
    resolver: zodResolver(requestApplicantDBSSchema),
    defaultValues: {
      applicantEmail: applicantEmail || "",
    },
  });

  const onSubmit = async (data: RequestApplicantDBSFormData) => {
    setIsLoading(true);
    try {
      // Step 1: Update applicant email in application if changed
      if (data.applicantEmail !== applicantEmail) {
        const { error: updateError } = await supabase
          .from("childminder_applications")
          .update({ email: data.applicantEmail })
          .eq("id", applicationId);

        if (updateError) {
          console.error("Error updating applicant email:", updateError);
          throw new Error("Failed to update applicant email");
        }
      }

      // Step 2: Send DBS request email to applicant (no summary email)
      const { error: emailError } = await supabase.functions.invoke(
        "send-dbs-request-email",
        {
          body: {
            memberId: applicationId, // Use application ID for tracking
            memberEmail: data.applicantEmail,
            applicantName,
            isApplicant: true, // Flag to prevent summary email
          },
        }
      );

      if (emailError) {
        console.error("Error sending DBS request email:", emailError);
        throw new Error("Failed to send DBS request email");
      }

      toast({
        title: "DBS Request Sent",
        description: `DBS request sent to ${applicantName} at ${data.applicantEmail}`,
      });

      onSuccess();
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error requesting applicant DBS:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send DBS request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Applicant DBS Check</DialogTitle>
          <DialogDescription>
            Send a DBS check request to {applicantName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="applicantEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Applicant Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="applicant@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send DBS Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
