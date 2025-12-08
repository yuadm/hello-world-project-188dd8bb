import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKTextarea, RKButton, RKRadio, RKSectionTitle, RKInfoBox, RKCheckbox } from "./rk";
import { Plus, Trash2 } from "lucide-react";
import { calculateEmploymentCoverage } from "@/lib/employmentHistoryCalculator";
import { format } from "date-fns";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section6Employment = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const employmentHistory = watch("employmentHistory") || [];
  const childVolunteered = watch("childVolunteered");

  // Calculate employment coverage
  const coverage = calculateEmploymentCoverage(employmentHistory);

  const addEmployment = () => {
    setValue("employmentHistory", [
      ...employmentHistory,
      { employer: "", role: "", startDate: "", endDate: "", reasonForLeaving: "" },
    ]);
  };

  const removeEmployment = (index: number) => {
    setValue("employmentHistory", employmentHistory.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Employment History & References"
        description="Tell us about your work history and provide references."
      />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Employment/Education History</h3>
      <p className="text-sm text-rk-text-light">
        Please provide details of your employment or education for the last 5 years. We need a complete 5-year history.
      </p>

      {/* Coverage Indicator */}
      {employmentHistory.length > 0 && (
        <div className="space-y-3">
          {coverage.isComplete ? (
            <RKInfoBox type="success" title={`5-Year Coverage: ${coverage.percentageCovered}%`}>
              <div className="w-full bg-white border border-rk-border rounded-lg h-4 overflow-hidden mt-2">
                <div
                  className="h-full bg-rk-success"
                  style={{ width: `${Math.min(coverage.percentageCovered, 100)}%` }}
                />
              </div>
              <p className="text-sm mt-2">✓ Complete 5-year employment/education history provided</p>
            </RKInfoBox>
          ) : (
            <RKInfoBox type="warning" title={`5-Year Coverage: ${coverage.percentageCovered}%`}>
              <div className="w-full bg-white border border-rk-border rounded-lg h-4 overflow-hidden mt-2">
                <div
                  className="h-full bg-rk-warning"
                  style={{ width: `${Math.min(coverage.percentageCovered, 100)}%` }}
                />
              </div>
              <p className="text-sm mt-2">
                You have covered {coverage.coveredMonths} of 60 months (5 years)
              </p>
              {coverage.hasGaps && coverage.gaps.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-bold">Gaps detected:</p>
                  <ul className="text-sm list-disc list-inside">
                    {coverage.gaps.map((gap, idx) => (
                      <li key={idx}>
                        {format(gap.start, "MMM yyyy")} to {format(gap.end, "MMM yyyy")} ({gap.months} months)
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2">
                    Please add more employment/education entries or explain these gaps below.
                  </p>
                </div>
              )}
            </RKInfoBox>
          )}
        </div>
      )}

      {employmentHistory.length === 0 && (
        <RKInfoBox type="info">
          Click "Add employment/education entry" below to start providing your 5-year history.
        </RKInfoBox>
      )}

      {employmentHistory.map((_, index) => (
        <div
          key={index}
          className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-rk-text">Employment/Education Entry {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeEmployment(index)}
              className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
          <RKInput
            label="Employer/Institution"
            {...register(`employmentHistory.${index}.employer`)}
          />
          <RKInput label="Role/Course" {...register(`employmentHistory.${index}.role`)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RKInput
              label="Start date"
              type="date"
              {...register(`employmentHistory.${index}.startDate`)}
            />
            <RKInput
              label="End date"
              type="date"
              {...register(`employmentHistory.${index}.endDate`)}
            />
          </div>
          <RKTextarea
            label="Reason for leaving"
            rows={2}
            {...register(`employmentHistory.${index}.reasonForLeaving`)}
          />
        </div>
      ))}

      <RKButton
        type="button"
        variant="secondary"
        onClick={addEmployment}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add employment/education entry
      </RKButton>

      <RKTextarea
        label="Explain any gaps in employment/education history"
        hint="If there are gaps in your 5-year history, please explain what you were doing during those periods (e.g., caring for family, traveling, unemployed, etc.)."
        rows={4}
        {...register("employmentGaps")}
      />

      <RKRadio
        legend="Have you previously worked or volunteered with children?"
        required
        name="childVolunteered"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={childVolunteered || ""}
        onChange={(value) => setValue("childVolunteered", value as "Yes" | "No")}
      />

      {childVolunteered === "Yes" && (
        <RKCheckbox
          name="childVolunteeredConsent"
          label="I consent to Ready Kids contacting my previous employers/organizations"
          hint="We may need to verify your experience working with children."
          checked={watch("childVolunteeredConsent") || false}
          onChange={(checked) => setValue("childVolunteeredConsent", checked)}
        />
      )}

      <div className="rk-divider" />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">References</h3>
      <p className="text-sm text-rk-text-light">Please provide two references who have known you for at least 2 years.</p>

      {/* Reference 1 */}
      <div className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
        <h4 className="font-semibold text-rk-text">Reference 1</h4>
        <RKInput label="Full name" required {...register("reference1Name")} />
        <RKInput label="Relationship to you" required {...register("reference1Relationship")} />
        <RKInput
          label="Contact details (email or phone)"
          required
          {...register("reference1Contact")}
        />
        <RKRadio
          legend="Is this a childcare-related reference?"
          required
          name="reference1Childcare"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={watch("reference1Childcare") || ""}
          onChange={(value) => setValue("reference1Childcare", value as "Yes" | "No")}
        />
      </div>

      {/* Reference 2 */}
      <div className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
        <h4 className="font-semibold text-rk-text">Reference 2</h4>
        <RKInput label="Full name" required {...register("reference2Name")} />
        <RKInput label="Relationship to you" required {...register("reference2Relationship")} />
        <RKInput
          label="Contact details (email or phone)"
          required
          {...register("reference2Contact")}
        />
        <RKRadio
          legend="Is this a childcare-related reference?"
          required
          name="reference2Childcare"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={watch("reference2Childcare") || ""}
          onChange={(value) => setValue("reference2Childcare", value as "Yes" | "No")}
        />
      </div>
    </div>
  );
};
