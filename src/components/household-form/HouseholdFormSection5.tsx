import { HouseholdFormData } from "@/pages/HouseholdForm";
import { RKInput, RKCheckbox, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection5({ formData, setFormData, validationErrors = {} }: Props) {
  const hasErrors = validationErrors.consentChecks || validationErrors.declarationTruth || validationErrors.declarationNotify;

  return (
    <div>
      <RKSectionTitle 
        title="5. Declaration & Submission"
        description="Please review your answers carefully. By submitting this form, you are making a legal declaration."
      />

      <div className="space-y-6">
        {hasErrors && (
          <RKInfoBox type="error">
            You must check all three boxes to proceed with your submission.
          </RKInfoBox>
        )}

        <div className="space-y-4">
          <RKCheckbox
            name="consentChecks"
            checked={formData.consentChecks}
            onChange={(checked) => 
              setFormData({ ...formData, consentChecks: checked })
            }
            label="I consent to Ready Kids carrying out all necessary checks, including with the DBS and local authorities, to assess my suitability."
            error={validationErrors.consentChecks}
          />

          <RKCheckbox
            name="declarationTruth"
            checked={formData.declarationTruth}
            onChange={(checked) => 
              setFormData({ ...formData, declarationTruth: checked })
            }
            label="I declare that the information provided is true, accurate, and complete. I understand that providing false information is an offence and will result in refusal or cancellation of my suitability status."
            error={validationErrors.declarationTruth}
          />

          <RKCheckbox
            name="declarationNotify"
            checked={formData.declarationNotify}
            onChange={(checked) => 
              setFormData({ ...formData, declarationNotify: checked })
            }
            label="I understand I must notify the childminder of any changes to this information, including any new cautions or convictions."
            error={validationErrors.declarationNotify}
          />
        </div>

        <div className="pt-6 border-t border-[#E2E8F0]">
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Electronic Signature</h3>
          
          <div className="space-y-4 max-w-md">
            <RKInput
              id="signatureFullName"
              label="Enter your full legal name to sign this form"
              required
              value={formData.signatureFullName}
              onChange={(e) => setFormData({ ...formData, signatureFullName: e.target.value })}
              error={validationErrors.signatureFullName}
            />

            <RKInput
              id="signatureDate"
              label="Date of signature"
              type="date"
              required
              value={formData.signatureDate}
              onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
