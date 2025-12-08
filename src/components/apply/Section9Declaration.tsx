import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKRadio, RKSectionTitle, RKInfoBox, RKCheckbox } from "./rk";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section9Declaration = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const paymentAmount = ageGroups.includes("0-5") || ageGroups.includes("5-7") ? "£200" : "£100";

  return (
    <div className="space-y-8">
      <RKSectionTitle title="Declaration & Payment" description="Please review and confirm the declarations below." />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Final Declarations</h3>

      <div className="space-y-4">
        <RKCheckbox name="declarationAccuracy" label="I confirm that all information provided is accurate and complete to the best of my knowledge" required checked={watch("declarationAccuracy") || false} onChange={(checked) => setValue("declarationAccuracy", checked)} />
        <RKCheckbox name="declarationChangeNotification" label="I will notify Ready Kids immediately of any changes to my circumstances, household, or suitability" required checked={watch("declarationChangeNotification") || false} onChange={(checked) => setValue("declarationChangeNotification", checked)} />
        <RKCheckbox name="declarationInspectionCooperation" label="I agree to cooperate with Ofsted inspections and comply with all regulatory requirements" required checked={watch("declarationInspectionCooperation") || false} onChange={(checked) => setValue("declarationInspectionCooperation", checked)} />
        <RKCheckbox name="declarationInformationSharing" label="I consent to information being shared with Ofsted, local authorities, and other relevant bodies as required" required checked={watch("declarationInformationSharing") || false} onChange={(checked) => setValue("declarationInformationSharing", checked)} />
        <RKCheckbox name="declarationDataProcessing" label="I consent to Ready Kids processing my personal data in accordance with GDPR and their privacy policy" required checked={watch("declarationDataProcessing") || false} onChange={(checked) => setValue("declarationDataProcessing", checked)} />
      </div>

      <div className="rk-divider" />
      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Electronic Signature</h3>

      <RKInput label="Full legal name" hint="This serves as your electronic signature. It must match your name exactly as provided in Section 1." required {...register("signatureFullName")} />
      <RKInput label="Date" type="date" required widthClass="10" {...register("signatureDate")} />

      <div className="rk-divider" />
      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Payment</h3>

      <RKInfoBox type="info" title={`Application Fee: ${paymentAmount}`}>
        Based on the age groups you selected, your registration fee is {paymentAmount}.
      </RKInfoBox>

      <RKRadio legend="Payment method" required name="paymentMethod" options={[{ value: "Card", label: "Debit/Credit Card" }, { value: "Bank Transfer", label: "Bank Transfer" }, { value: "Invoice", label: "Invoice (for organizations)" }]} value={watch("paymentMethod") || ""} onChange={(value) => setValue("paymentMethod", value)} />
    </div>
  );
};
