import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReferenceFormSubmission {
  formToken: string;
  responseData: {
    // Confirmation
    confirmedRelationship: string;
    knownForYears: string;
    
    // Character assessment
    characterDescription: string;
    isReliable: string;
    reliableComments?: string;
    isPatient: string;
    patientComments?: string;
    hasGoodJudgment: string;
    judgmentComments?: string;
    
    // Childcare suitability (if applicable)
    observedWithChildren?: string;
    interactionDescription?: string;
    suitabilityConcerns?: string;
    
    // Professional
    integrityConcerns: string;
    integrityConcernsDetails?: string;
    wouldRecommend: string;
    recommendationComments?: string;
    additionalInformation?: string;
    
    // Declaration
    declarationAccurate: boolean;
    signatureName: string;
    signatureDate: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const submission: ReferenceFormSubmission = await req.json();
    console.log('Submitting reference form for token:', submission.formToken);

    const { formToken, responseData } = submission;

    // Verify token exists and get request details
    const { data: referenceRequest, error: fetchError } = await supabaseClient
      .from('reference_requests')
      .select('*')
      .eq('form_token', formToken)
      .single();

    if (fetchError || !referenceRequest) {
      console.error('Invalid or expired token:', fetchError);
      throw new Error('Invalid or expired reference request token');
    }

    if (referenceRequest.request_status === 'completed') {
      throw new Error('This reference has already been submitted');
    }

    // Update reference request with response
    const { error: updateError } = await supabaseClient
      .from('reference_requests')
      .update({
        request_status: 'completed',
        response_received_date: new Date().toISOString(),
        response_data: responseData,
        updated_at: new Date().toISOString(),
      })
      .eq('form_token', formToken);

    if (updateError) {
      console.error('Error updating reference request:', updateError);
      throw updateError;
    }

    console.log('Reference form submitted successfully');

    // Send confirmation email to referee
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');

    if (brevoApiKey && senderEmail && referenceRequest.referee_email) {
      const confirmationEmail = {
        sender: { email: senderEmail, name: "Ready Kids" },
        to: [{ email: referenceRequest.referee_email, name: referenceRequest.referee_name }],
        subject: "Reference Submission Confirmed",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #003078;">Thank You for Your Reference</h2>
              <p>Dear ${referenceRequest.referee_name},</p>
              <p>Thank you for completing the reference form. Your response has been successfully submitted.</p>
              <p>Your input is valuable in helping us assess the applicant's suitability to work with children.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>
              Ready Kids Registration Team</p>
            </div>
          </body>
          </html>
        `,
      };

      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json',
        },
        body: JSON.stringify(confirmationEmail),
      });
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reference submitted successfully. Thank you for your time.' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-reference-form:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});