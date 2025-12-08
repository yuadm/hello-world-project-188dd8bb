import { HouseholdFormData } from "@/pages/HouseholdForm";
import { RKRadio, RKTextarea, RKSectionTitle } from "@/components/apply/rk";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection4({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <RKSectionTitle 
        title="4. Health Declaration"
        description="This information is treated confidentially and helps us ensure you do not pose any medical risk to children."
      />

      <div className="space-y-8">
        <div>
          <RKRadio
            name="healthCondition"
            legend="Do you have any current or previous medical conditions (physical or mental) that may impact your suitability to be in a home where childminding takes place?"
            hint="This includes significant mental health conditions, neurological conditions, or physical impairments."
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.healthCondition}
            onChange={(value) => setFormData({ ...formData, healthCondition: value })}
            error={validationErrors.healthCondition}
          />

          {formData.healthCondition === "Yes" && (
            <div className="mt-4">
              <RKTextarea
                id="healthConditionDetails"
                label="Please provide details"
                hint="Include details of the condition, any treatment or medication, and how you manage it. We may require you to complete a full Health Declaration Form signed by your GP."
                required
                rows={5}
                value={formData.healthConditionDetails}
                onChange={(e) => setFormData({ ...formData, healthConditionDetails: e.target.value })}
              />
            </div>
          )}
        </div>

        <RKRadio
          name="smoker"
          legend="Are you a smoker?"
          hint="This is for safeguarding and health promotion purposes."
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.smoker}
          onChange={(value) => setFormData({ ...formData, smoker: value })}
          error={validationErrors.smoker}
        />
      </div>
    </div>
  );
}
