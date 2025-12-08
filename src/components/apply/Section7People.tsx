import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKRadio, RKButton, RKSectionTitle, RKInfoBox } from "./rk";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section7People = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const adultsInHome = watch("adultsInHome");
  const adults = watch("adults") || [];
  const childrenInHome = watch("childrenInHome");
  const children = watch("children") || [];
  const premisesType = watch("premisesType");
  
  // Only show household member questions for domestic premises
  const showHouseholdQuestions = premisesType === "Domestic" || !premisesType;

  const addAdult = () => {
    setValue("adults", [...adults, { fullName: "", relationship: "", dob: "" }]);
  };

  const removeAdult = (index: number) => {
    setValue("adults", adults.filter((_, i) => i !== index));
  };

  const addChild = () => {
    setValue("children", [...children, { fullName: "", dob: "" }]);
  };

  const removeChild = (index: number) => {
    setValue("children", children.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Household Members"
        description="Tell us about other people living at your childminding premises."
      />

      <RKInfoBox type="info">
        <strong>Important:</strong> All adults (16+) who live at your childminding premises will require DBS checks. Children under 16 do not require checks but must be declared.
      </RKInfoBox>

      {/* Adults in Home - Only for domestic premises */}
      {showHouseholdQuestions && (
        <>
          <RKRadio
            legend="Do any other adults (aged 16+) live at your childminding premises?"
            hint="Include partners, adult children, relatives, lodgers, etc."
            required
            name="adultsInHome"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={adultsInHome || ""}
            onChange={(value) => setValue("adultsInHome", value as "Yes" | "No")}
          />

          {adultsInHome === "Yes" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-rk-secondary">Adult Household Members</h3>
              {adults.map((_, index) => (
                <div
                  key={index}
                  className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-rk-text">Adult {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAdult(index)}
                      className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                  <RKInput 
                    label="Full name" 
                    required
                    {...register(`adults.${index}.fullName`)} 
                  />
                  <RKInput 
                    label="Relationship to you"
                    hint="e.g., Partner, Adult child, Parent, Lodger, etc."
                    required
                    {...register(`adults.${index}.relationship`)} 
                  />
                  <RKInput
                    label="Date of birth"
                    type="date"
                    required
                    widthClass="10"
                    {...register(`adults.${index}.dob`)}
                  />
                </div>
              ))}
              <RKButton
                type="button"
                variant="secondary"
                onClick={addAdult}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add adult
              </RKButton>
            </div>
          )}

          {/* Children in Home */}
          <RKRadio
            legend="Do any children (under 16) live at your childminding premises?"
            hint="Include your own children, stepchildren, fostered children, etc."
            required
            name="childrenInHome"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={childrenInHome || ""}
            onChange={(value) => setValue("childrenInHome", value as "Yes" | "No")}
          />

          {childrenInHome === "Yes" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-rk-secondary">Children in Household</h3>
              {children.map((_, index) => (
                <div
                  key={index}
                  className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-rk-text">Child {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                  <RKInput 
                    label="Full name"
                    required
                    {...register(`children.${index}.fullName`)} 
                  />
                  <RKInput
                    label="Date of birth"
                    type="date"
                    required
                    widthClass="10"
                    {...register(`children.${index}.dob`)}
                  />
                </div>
              ))}
              <RKButton
                type="button"
                variant="secondary"
                onClick={addChild}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add child
              </RKButton>
            </div>
          )}
        </>
      )}

      {!showHouseholdQuestions && (
        <RKInfoBox type="info">
          <strong>Note:</strong> Household member questions are not required for non-domestic premises.
        </RKInfoBox>
      )}
    </div>
  );
};
