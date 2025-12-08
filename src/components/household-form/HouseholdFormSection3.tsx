import { HouseholdFormData } from "@/pages/HouseholdForm";
import { RKInput, RKRadio, RKTextarea, RKSectionTitle, RKInfoBox } from "@/components/apply/rk";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection3({ formData, setFormData, validationErrors = {} }: Props) {
  return (
    <div>
      <RKSectionTitle 
        title="3. Vetting & Suitability"
        description="This section covers mandatory background checks required for anyone living or working in a childminding setting."
      />

      <div className="space-y-10">
        {/* Previous Registrations */}
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Previous Registrations</h3>
          <RKRadio
            name="prevReg"
            legend="Have you ever been registered with Ofsted, a childminder agency, or any other regulatory body for childcare?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.prevReg}
            onChange={(value) => setFormData({ ...formData, prevReg: value })}
            error={validationErrors.prevReg}
          />

          {formData.prevReg === "Yes" && (
            <div className="mt-4">
              <RKTextarea
                id="prevRegInfo"
                label="Please provide details"
                hint="Include the regulatory body name, registration number, and dates."
                required
                rows={4}
                value={formData.prevRegInfo}
                onChange={(e) => setFormData({ ...formData, prevRegInfo: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* DBS Section */}
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">DBS (Disclosure and Barring Service)</h3>
          <RKRadio
            name="hasDBS"
            legend="Do you currently hold an Enhanced DBS certificate for a child workforce role?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.hasDBS}
            onChange={(value) => setFormData({ ...formData, hasDBS: value })}
            error={validationErrors.hasDBS}
          />

          {formData.hasDBS === "No" && (
            <RKInfoBox type="error" className="mt-4">
              You must obtain an Enhanced DBS check. We will initiate this process for you upon submission of this form.
            </RKInfoBox>
          )}

          {formData.hasDBS === "Yes" && (
            <div className="mt-4 space-y-6">
              <RKInput
                id="dbsNumber"
                label="DBS certificate number"
                hint="This is 12 digits, found on your DBS certificate"
                required
                className="max-w-xs"
                value={formData.dbsNumber}
                onChange={(e) => setFormData({ ...formData, dbsNumber: e.target.value.replace(/\D/g, "").slice(0, 12) })}
                error={validationErrors.dbsNumber}
              />

              <RKRadio
                name="dbsUpdate"
                legend="Are you subscribed to the DBS Update Service?"
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" }
                ]}
                value={formData.dbsUpdate}
                onChange={(value) => setFormData({ ...formData, dbsUpdate: value })}
              />
            </div>
          )}
        </div>

        {/* Criminal History */}
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Criminal History Declaration</h3>
          
          <RKInfoBox type="info" className="mb-4">
            You must declare everything, no matter how long ago it occurred. Due to the nature of working with children, the rules on 'spent' convictions do not apply. This will be verified by your DBS check.
          </RKInfoBox>

          <RKRadio
            name="offenceHistory"
            legend="Have you ever received a reprimand, warning, caution, or conviction for any criminal offence?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.offenceHistory}
            onChange={(value) => setFormData({ ...formData, offenceHistory: value })}
            error={validationErrors.offenceHistory}
          />

          {formData.offenceHistory === "Yes" && (
            <div className="mt-4">
              <RKTextarea
                id="offenceDetails"
                label="Please provide details of all offences"
                required
                rows={5}
                value={formData.offenceDetails}
                onChange={(e) => setFormData({ ...formData, offenceDetails: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* Disqualification */}
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Suitability Declaration</h3>
          
          <RKInfoBox type="info" className="mb-4">
            You are 'disqualified' if you have been barred from working with children, had a child removed from your care by court order, or had a registration cancelled in the past. Review the official{" "}
            <a 
              href="https://www.gov.uk/guidance/disqualification-under-the-childcare-act-2006" 
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#2563EB] hover:text-[#1D4ED8]"
            >
              GOV.UK guidance
            </a>{" "}
            if unsure.
          </RKInfoBox>

          <RKRadio
            name="disqualified"
            legend="Are you disqualified under the Childcare Act 2006?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.disqualified}
            onChange={(value) => setFormData({ ...formData, disqualified: value })}
            error={validationErrors.disqualified}
          />

          {formData.disqualified === "Yes" && (
            <RKInfoBox type="error" className="mt-4">
              If you are disqualified, we cannot proceed with your application unless you have received a waiver from Ofsted. Please contact us immediately.
            </RKInfoBox>
          )}
        </div>

        {/* Social Services */}
        <div>
          <RKInfoBox type="info" className="mb-4">
            You must declare any involvement, including referrals or assessments, even if the case was closed. Past involvement does not automatically disqualify you, but we must explore the circumstances.
          </RKInfoBox>

          <RKRadio
            name="socialServices"
            legend="Have you ever been involved with social services in connection with your own children?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.socialServices}
            onChange={(value) => setFormData({ ...formData, socialServices: value })}
            error={validationErrors.socialServices}
          />

          {formData.socialServices === "Yes" && (
            <div className="mt-4">
              <RKTextarea
                id="socialServicesInfo"
                label="Please provide details"
                hint="Include dates, the local authority involved, and the outcome."
                required
                rows={5}
                value={formData.socialServicesInfo}
                onChange={(e) => setFormData({ ...formData, socialServicesInfo: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
