import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKRadio, RKTextarea, RKButton, RKSectionTitle, RKInfoBox } from "./rk";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section8Suitability = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  
  const prevRegOfsted = watch("prevRegOfsted");
  const prevRegOfstedDetails = watch("prevRegOfstedDetails") || [];
  const prevRegAgency = watch("prevRegAgency");
  const prevRegAgencyDetails = watch("prevRegAgencyDetails") || [];
  const prevRegOtherUK = watch("prevRegOtherUK");
  const prevRegOtherUKDetails = watch("prevRegOtherUKDetails") || [];
  const prevRegEU = watch("prevRegEU");
  const prevRegEUDetails = watch("prevRegEUDetails") || [];
  
  const healthCondition = watch("healthCondition");
  const disqualified = watch("disqualified");
  const socialServices = watch("socialServices");
  const otherCircumstances = watch("otherCircumstances");
  const hasDBS = watch("hasDBS");
  const dbsEnhanced = watch("dbsEnhanced");
  const dbsUpdate = watch("dbsUpdate");
  const offenceHistory = watch("offenceHistory");
  const offenceDetails = watch("offenceDetails") || [];

  const addRegistration = (field: "prevRegOfstedDetails" | "prevRegAgencyDetails" | "prevRegOtherUKDetails" | "prevRegEUDetails") => {
    const current = watch(field) || [];
    setValue(field, [...current, { regulator: "", registrationNumber: "", dates: "", status: "" }]);
  };

  const removeRegistration = (field: "prevRegOfstedDetails" | "prevRegAgencyDetails" | "prevRegOtherUKDetails" | "prevRegEUDetails", index: number) => {
    const current = watch(field) || [];
    setValue(field, current.filter((_, i) => i !== index));
  };

  const addOffence = () => {
    setValue("offenceDetails", [...offenceDetails, { date: "", description: "", outcome: "" }]);
  };

  const removeOffence = (index: number) => {
    setValue("offenceDetails", offenceDetails.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <RKSectionTitle title="Suitability & Vetting" description="We need to check your suitability to work with children." />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Previous Registrations</h3>

      <RKRadio legend="Have you previously been registered with Ofsted as a childcare provider?" required name="prevRegOfsted" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={prevRegOfsted || ""} onChange={(value) => setValue("prevRegOfsted", value as "Yes" | "No")} />

      {prevRegOfsted === "Yes" && (
        <div className="space-y-4">
          {prevRegOfstedDetails.map((_, index) => (
            <div key={index} className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
              <div className="flex justify-between items-center"><h5 className="font-semibold text-rk-text">Registration {index + 1}</h5><button type="button" onClick={() => removeRegistration("prevRegOfstedDetails", index)} className="text-rk-error text-sm flex items-center gap-1"><Trash2 className="h-4 w-4" />Remove</button></div>
              <RKInput label="Regulator" required {...register(`prevRegOfstedDetails.${index}.regulator`)} />
              <RKInput label="Registration number" required widthClass="10" {...register(`prevRegOfstedDetails.${index}.registrationNumber`)} />
              <RKInput label="Dates of registration" required {...register(`prevRegOfstedDetails.${index}.dates`)} />
              <RKInput label="Current status" required {...register(`prevRegOfstedDetails.${index}.status`)} />
            </div>
          ))}
          <RKButton type="button" variant="secondary" onClick={() => addRegistration("prevRegOfstedDetails")} className="flex items-center gap-2"><Plus className="h-4 w-4" />Add registration</RKButton>
        </div>
      )}

      <RKRadio legend="Have you previously been registered with a Childminder Agency?" required name="prevRegAgency" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={prevRegAgency || ""} onChange={(value) => setValue("prevRegAgency", value as "Yes" | "No")} />

      <RKRadio legend="Have you been registered with any other UK regulator for childcare?" required name="prevRegOtherUK" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={prevRegOtherUK || ""} onChange={(value) => setValue("prevRegOtherUK", value as "Yes" | "No")} />

      <RKRadio legend="Have you previously been registered in any EU/EEA country for childcare?" required name="prevRegEU" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={prevRegEU || ""} onChange={(value) => setValue("prevRegEU", value as "Yes" | "No")} />

      <div className="rk-divider" />
      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Health & Lifestyle</h3>

      <RKRadio legend="Do you have any medical conditions that may impact your ability to work as a childminder?" required name="healthCondition" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={healthCondition || ""} onChange={(value) => setValue("healthCondition", value as "Yes" | "No")} />
      {healthCondition === "Yes" && <RKTextarea label="Please provide details" required rows={4} {...register("healthConditionDetails")} />}

      <RKRadio legend="Is anyone who lives or works at the premises a smoker?" required name="smoker" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={watch("smoker") || ""} onChange={(value) => setValue("smoker", value as "Yes" | "No")} />

      <div className="rk-divider" />
      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Suitability Declaration</h3>

      <RKRadio legend="Are you disqualified under the Childcare Act 2006?" required name="disqualified" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={disqualified || ""} onChange={(value) => setValue("disqualified", value as "Yes" | "No")} />

      <RKRadio legend="Have you ever been involved with social services in connection with your own children?" required name="socialServices" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={socialServices || ""} onChange={(value) => setValue("socialServices", value as "Yes" | "No")} />
      {socialServices === "Yes" && <RKTextarea label="Please provide details" required rows={4} {...register("socialServicesDetails")} />}

      <RKRadio legend="Are you aware of any other circumstances that might affect your suitability?" required name="otherCircumstances" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={otherCircumstances || ""} onChange={(value) => setValue("otherCircumstances", value as "Yes" | "No")} />
      {otherCircumstances === "Yes" && <RKTextarea label="Please provide details" required rows={4} {...register("otherCircumstancesDetails")} />}

      <div className="rk-divider" />
      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">DBS & Vetting</h3>

      <RKRadio legend="Do you currently hold an Enhanced DBS certificate dated within the last 3 years?" required name="hasDBS" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={hasDBS || ""} onChange={(value) => setValue("hasDBS", value as "Yes" | "No")} />

      {hasDBS === "Yes" && (
        <div className="space-y-4">
          <RKInput label="DBS certificate number (12 digits)" required widthClass="20" {...register("dbsNumber")} />
          <RKRadio legend="Is the certificate an Enhanced check with barred lists?" required name="dbsEnhanced" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={dbsEnhanced || ""} onChange={(value) => setValue("dbsEnhanced", value as "Yes" | "No")} />
          <RKRadio legend="Are you subscribed to the DBS Update Service?" required name="dbsUpdate" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={dbsUpdate || ""} onChange={(value) => setValue("dbsUpdate", value as "Yes" | "No")} />
        </div>
      )}

      <RKRadio legend="Do you have any unspent convictions, cautions, or pending charges?" required name="offenceHistory" options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} value={offenceHistory || ""} onChange={(value) => setValue("offenceHistory", value as "Yes" | "No")} />

      {offenceHistory === "Yes" && (
        <div className="space-y-4">
          {offenceDetails.map((_, index) => (
            <div key={index} className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4">
              <div className="flex justify-between items-center"><h5 className="font-semibold text-rk-text">Offence {index + 1}</h5><button type="button" onClick={() => removeOffence(index)} className="text-rk-error text-sm flex items-center gap-1"><Trash2 className="h-4 w-4" />Remove</button></div>
              <RKInput label="Date" type="date" {...register(`offenceDetails.${index}.date`)} />
              <RKTextarea label="Description" rows={2} {...register(`offenceDetails.${index}.description`)} />
              <RKInput label="Outcome" {...register(`offenceDetails.${index}.outcome`)} />
            </div>
          ))}
          <RKButton type="button" variant="secondary" onClick={addOffence} className="flex items-center gap-2"><Plus className="h-4 w-4" />Add offence</RKButton>
        </div>
      )}
    </div>
  );
};
