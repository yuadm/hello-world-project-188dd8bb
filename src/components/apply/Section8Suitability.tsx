import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKInput } from "./GovUKInput";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKTextarea } from "./GovUKTextarea";
import { GovUKButton } from "./GovUKButton";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section8Suitability = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  
  // Previous registrations
  const prevRegOfsted = watch("prevRegOfsted");
  const prevRegOfstedDetails = watch("prevRegOfstedDetails") || [];
  const prevRegAgency = watch("prevRegAgency");
  const prevRegAgencyDetails = watch("prevRegAgencyDetails") || [];
  const prevRegOtherUK = watch("prevRegOtherUK");
  const prevRegOtherUKDetails = watch("prevRegOtherUKDetails") || [];
  const prevRegEU = watch("prevRegEU");
  const prevRegEUDetails = watch("prevRegEUDetails") || [];
  
  // Suitability
  const healthCondition = watch("healthCondition");
  const disqualified = watch("disqualified");
  const socialServices = watch("socialServices");
  const otherCircumstances = watch("otherCircumstances");
  
  // DBS
  const hasDBS = watch("hasDBS");
  const dbsEnhanced = watch("dbsEnhanced");
  const dbsUpdate = watch("dbsUpdate");
  
  // Offences
  const offenceHistory = watch("offenceHistory");
  const offenceDetails = watch("offenceDetails") || [];

  // Add/remove functions for previous registrations
  const addRegistration = (field: "prevRegOfstedDetails" | "prevRegAgencyDetails" | "prevRegOtherUKDetails" | "prevRegEUDetails") => {
    const current = watch(field) || [];
    setValue(field, [...current, { regulator: "", registrationNumber: "", dates: "", status: "" }]);
  };

  const removeRegistration = (
    field: "prevRegOfstedDetails" | "prevRegAgencyDetails" | "prevRegOtherUKDetails" | "prevRegEUDetails",
    index: number
  ) => {
    const current = watch(field) || [];
    setValue(field, current.filter((_, i) => i !== index));
  };

  // Add/remove functions for offence details
  const addOffence = () => {
    setValue("offenceDetails", [...offenceDetails, { date: "", description: "", outcome: "" }]);
  };

  const removeOffence = (index: number) => {
    setValue("offenceDetails", offenceDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">8. Suitability & Vetting</h2>

      <h3 className="text-xl font-bold border-t pt-6">Previous Registrations</h3>

      {/* Ofsted Registrations */}
      <GovUKRadio
        legend="Have you previously been registered with Ofsted as a childcare provider?"
        required
        name="prevRegOfsted"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={prevRegOfsted || "No"}
        onChange={(value) => setValue("prevRegOfsted", value as "Yes" | "No")}
      />

      {prevRegOfsted === "Yes" && (
        <div className="space-y-4 p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h4 className="font-semibold">Ofsted Registration Details</h4>
          {prevRegOfstedDetails.map((_, index) => (
            <div key={index} className="p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Registration {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeRegistration("prevRegOfstedDetails", index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Regulator"
                hint="e.g., Ofsted"
                required
                {...register(`prevRegOfstedDetails.${index}.regulator`)}
              />
              <GovUKInput
                label="Registration number"
                required
                widthClass="10"
                {...register(`prevRegOfstedDetails.${index}.registrationNumber`)}
              />
              <GovUKInput
                label="Dates of registration"
                hint="e.g., January 2018 to March 2022"
                required
                {...register(`prevRegOfstedDetails.${index}.dates`)}
              />
              <GovUKInput
                label="Current status"
                hint="e.g., Expired, Voluntarily resigned, etc."
                required
                {...register(`prevRegOfstedDetails.${index}.status`)}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={() => addRegistration("prevRegOfstedDetails")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another registration
          </GovUKButton>
        </div>
      )}

      {/* Agency Registrations */}
      <GovUKRadio
        legend="Have you previously been registered with a Childminder Agency?"
        required
        name="prevRegAgency"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={prevRegAgency || "No"}
        onChange={(value) => setValue("prevRegAgency", value as "Yes" | "No")}
      />

      {prevRegAgency === "Yes" && (
        <div className="space-y-4 p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h4 className="font-semibold">Agency Registration Details</h4>
          {prevRegAgencyDetails.map((_, index) => (
            <div key={index} className="p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Registration {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeRegistration("prevRegAgencyDetails", index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Agency name"
                required
                {...register(`prevRegAgencyDetails.${index}.regulator`)}
              />
              <GovUKInput
                label="Registration number"
                widthClass="10"
                {...register(`prevRegAgencyDetails.${index}.registrationNumber`)}
              />
              <GovUKInput
                label="Dates of registration"
                hint="e.g., January 2018 to March 2022"
                required
                {...register(`prevRegAgencyDetails.${index}.dates`)}
              />
              <GovUKInput
                label="Current status"
                hint="e.g., Expired, Voluntarily resigned, etc."
                required
                {...register(`prevRegAgencyDetails.${index}.status`)}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={() => addRegistration("prevRegAgencyDetails")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another registration
          </GovUKButton>
        </div>
      )}

      {/* Other UK Registrations */}
      <GovUKRadio
        legend="Have you been registered with any other UK regulator for childcare?"
        hint="This includes registrations in Scotland, Wales, or Northern Ireland."
        required
        name="prevRegOtherUK"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={prevRegOtherUK || "No"}
        onChange={(value) => setValue("prevRegOtherUK", value as "Yes" | "No")}
      />

      {prevRegOtherUK === "Yes" && (
        <div className="space-y-4 p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h4 className="font-semibold">Other UK Registration Details</h4>
          {prevRegOtherUKDetails.map((_, index) => (
            <div key={index} className="p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Registration {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeRegistration("prevRegOtherUKDetails", index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Regulator name"
                hint="e.g., Care Inspectorate Scotland, Care Inspectorate Wales"
                required
                {...register(`prevRegOtherUKDetails.${index}.regulator`)}
              />
              <GovUKInput
                label="Registration number"
                widthClass="10"
                {...register(`prevRegOtherUKDetails.${index}.registrationNumber`)}
              />
              <GovUKInput
                label="Dates of registration"
                hint="e.g., January 2018 to March 2022"
                required
                {...register(`prevRegOtherUKDetails.${index}.dates`)}
              />
              <GovUKInput
                label="Current status"
                hint="e.g., Expired, Voluntarily resigned, etc."
                required
                {...register(`prevRegOtherUKDetails.${index}.status`)}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={() => addRegistration("prevRegOtherUKDetails")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another registration
          </GovUKButton>
        </div>
      )}

      {/* EU/EEA Registrations */}
      <GovUKRadio
        legend="Have you previously been registered in any EU/EEA country for childcare?"
        required
        name="prevRegEU"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={prevRegEU || "No"}
        onChange={(value) => setValue("prevRegEU", value as "Yes" | "No")}
      />

      {prevRegEU === "Yes" && (
        <div className="space-y-4 p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h4 className="font-semibold">EU/EEA Registration Details</h4>
          {prevRegEUDetails.map((_, index) => (
            <div key={index} className="p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Registration {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeRegistration("prevRegEUDetails", index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Country and regulator"
                hint="e.g., France - Direction départementale de la cohésion sociale"
                required
                {...register(`prevRegEUDetails.${index}.regulator`)}
              />
              <GovUKInput
                label="Registration number"
                widthClass="10"
                {...register(`prevRegEUDetails.${index}.registrationNumber`)}
              />
              <GovUKInput
                label="Dates of registration"
                hint="e.g., January 2018 to March 2022"
                required
                {...register(`prevRegEUDetails.${index}.dates`)}
              />
              <GovUKInput
                label="Current status"
                hint="e.g., Expired, Voluntarily resigned, etc."
                required
                {...register(`prevRegEUDetails.${index}.status`)}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={() => addRegistration("prevRegEUDetails")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another registration
          </GovUKButton>
        </div>
      )}

      <h3 className="text-xl font-bold border-t pt-6">Health & Lifestyle</h3>

      <GovUKRadio
        legend="Do you have any current or previous medical conditions that may impact your ability to work as a childminder?"
        hint="This includes significant mental health conditions, neurological conditions, or physical impairments."
        required
        name="healthCondition"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={healthCondition || "No"}
        onChange={(value) => setValue("healthCondition", value as "Yes" | "No")}
      />

      {healthCondition === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          hint="Include details of the condition, any treatment or medication, and how you manage it."
          required
          rows={5}
          {...register("healthConditionDetails")}
        />
      )}

      <GovUKRadio
        legend="Is anyone who lives or works at the premises a smoker?"
        required
        name="smoker"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={watch("smoker") || "No"}
        onChange={(value) => setValue("smoker", value as "Yes" | "No")}
      />

      <h3 className="text-xl font-bold border-t pt-6">Suitability Declaration</h3>

      <GovUKRadio
        legend="Are you disqualified under the Childcare Act 2006?"
        required
        name="disqualified"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={disqualified || "No"}
        onChange={(value) => setValue("disqualified", value as "Yes" | "No")}
      />

      <GovUKRadio
        legend="Have you ever been involved with social services in connection with your own children?"
        required
        name="socialServices"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={socialServices || "No"}
        onChange={(value) => setValue("socialServices", value as "Yes" | "No")}
      />

      {socialServices === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          hint="Include dates, the local authority involved, and the outcome."
          required
          rows={5}
          {...register("socialServicesDetails")}
        />
      )}

      <GovUKRadio
        legend="Are you aware of any other circumstances that might affect your suitability to care for children?"
        required
        name="otherCircumstances"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={otherCircumstances || "No"}
        onChange={(value) => setValue("otherCircumstances", value as "Yes" | "No")}
      />

      {otherCircumstances === "Yes" && (
        <GovUKTextarea
          label="Please provide details"
          required
          rows={4}
          {...register("otherCircumstancesDetails")}
        />
      )}

      <h3 className="text-xl font-bold border-t pt-6">DBS & Vetting</h3>

      <GovUKRadio
        legend="Do you currently hold an Enhanced DBS certificate dated within the last 3 years?"
        required
        name="hasDBS"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={hasDBS || "No"}
        onChange={(value) => setValue("hasDBS", value as "Yes" | "No")}
      />

      {hasDBS === "Yes" && (
        <div className="space-y-6">
          <GovUKInput
            label="DBS certificate number (12 digits)"
            required
            widthClass="10"
            maxLength={12}
            {...register("dbsNumber")}
          />

          <GovUKRadio
            legend="Is the certificate an Enhanced check with barred lists for a home-based role?"
            required
            name="dbsEnhanced"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={dbsEnhanced || ""}
            onChange={(value) => setValue("dbsEnhanced", value as "Yes" | "No")}
          />

          <GovUKRadio
            legend="Are you subscribed to the DBS Update Service?"
            required
            name="dbsUpdate"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={dbsUpdate || ""}
            onChange={(value) => setValue("dbsUpdate", value as "Yes" | "No")}
          />
        </div>
      )}

      <GovUKRadio
        legend="Have you ever received a reprimand or final warning, been given a caution for, or been convicted of, any criminal offences?"
        hint="You must declare everything, no matter how long ago it occurred."
        required
        name="offenceHistory"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={offenceHistory || "No"}
        onChange={(value) => setValue("offenceHistory", value as "Yes" | "No")}
      />

      {offenceHistory === "Yes" && (
        <div className="space-y-4 p-4 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h4 className="font-semibold">Offence Details</h4>
          <p className="text-sm text-[hsl(var(--govuk-text-secondary))]">
            Please provide details of each offence, caution, or conviction. Include everything, no matter how long ago.
          </p>
          {offenceDetails.map((_, index) => (
            <div key={index} className="p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))] space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Offence {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeOffence(index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Date of offence/caution/conviction"
                hint="Approximate date is acceptable"
                type="date"
                required
                widthClass="10"
                {...register(`offenceDetails.${index}.date`)}
              />
              <GovUKTextarea
                label="Nature of offence"
                hint="Describe the offence, caution, reprimand, or conviction"
                required
                rows={3}
                {...register(`offenceDetails.${index}.description`)}
              />
              <GovUKTextarea
                label="Sentence or outcome"
                hint="Include details of any sentence, fine, community service, or outcome"
                required
                rows={3}
                {...register(`offenceDetails.${index}.outcome`)}
              />
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={addOffence}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another offence
          </GovUKButton>
        </div>
      )}
    </div>
  );
};
