import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKRadio, RKInput, RKSelect, RKButton, RKSectionTitle, RKInfoBox, RKCheckbox } from "./rk";
import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  calculateCapacityRatios,
  validateCapacity,
  getCapacityGuidanceText,
} from "@/lib/capacityCalculator";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section4Service = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const workWithOthers = watch("workWithOthers");
  const numberOfAssistants = watch("numberOfAssistants") || 1;
  const assistants = watch("assistants") || [];
  const proposedUnder1 = watch("proposedUnder1") || 0;
  const proposedUnder5 = watch("proposedUnder5") || 0;
  const proposed5to8 = watch("proposed5to8") || 0;
  const proposed8plus = watch("proposed8plus") || 0;

  const toggleAgeGroup = (ageGroup: string) => {
    if (ageGroups.includes(ageGroup)) {
      setValue("ageGroups", ageGroups.filter((g) => g !== ageGroup));
    } else {
      setValue("ageGroups", [...ageGroups, ageGroup]);
    }
  };

  const addAssistant = () => {
    setValue("assistants", [...assistants, { firstName: "", lastName: "", dob: "", role: "", email: "", phone: "" }]);
  };

  const removeAssistant = (index: number) => {
    setValue("assistants", assistants.filter((_, i) => i !== index));
  };

  // Calculate capacity ratios
  const capacityRatios = useMemo(() => {
    return calculateCapacityRatios(workWithOthers, numberOfAssistants);
  }, [workWithOthers, numberOfAssistants]);

  // Validate proposed numbers
  const validation = useMemo(() => {
    return validateCapacity(
      {
        under1: proposedUnder1,
        under5: proposedUnder5,
        age5to8: proposed5to8,
        age8plus: proposed8plus,
      },
      capacityRatios
    );
  }, [proposedUnder1, proposedUnder5, proposed5to8, proposed8plus, capacityRatios]);

  const guidanceText = getCapacityGuidanceText(capacityRatios);

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Your Childminding Service"
        description="Tell us about the childcare services you plan to offer."
      />

      <div className="space-y-4">
        <label className="block text-sm font-medium text-rk-text">
          Which age groups will you care for?<span className="text-rk-error ml-1">*</span>
        </label>
        <div className="space-y-3">
          {[
            { value: "0-5", label: "Children aged 0-5 years (Early Years Foundation Stage)" },
            { value: "5-7", label: "Children aged 5-7 years" },
            { value: "8+", label: "Children aged 8 years and over" },
          ].map((option) => (
            <RKCheckbox
              key={option.value}
              name={`ageGroup-${option.value}`}
              label={option.label}
              checked={ageGroups.includes(option.value)}
              onChange={() => toggleAgeGroup(option.value)}
            />
          ))}
        </div>
      </div>

      <RKRadio
        legend="Will you work with any assistants or co-childminders?"
        required
        name="workWithOthers"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={workWithOthers || ""}
        onChange={(value) => setValue("workWithOthers", value as "Yes" | "No")}
      />

      {workWithOthers === "Yes" && (
        <div className="space-y-4">
          <RKInput
            label="How many assistants/co-childminders?"
            type="number"
            required
            widthClass="10"
            min={1}
            max={3}
            hint="Maximum 3 assistants"
            {...register("numberOfAssistants", { valueAsNumber: true })}
          />
          
          {numberOfAssistants > 3 && (
            <RKInfoBox type="error">
              You cannot work with more than 3 assistants. Please adjust the number.
            </RKInfoBox>
          )}

          {/* Assistants Details */}
          <div className="space-y-6 border-t border-rk-border pt-6">
            <RKInfoBox type="info" title="Assistants and Co-childminders Details">
              Anyone working with you must complete a full suitability check (Form CMA-A1). 
              Please provide their basic details below so we can initiate their application.
            </RKInfoBox>
            
            {assistants.map((_, index) => (
              <div
                key={index}
                className="p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-lg text-rk-text">Person {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeAssistant(index)}
                    className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 font-medium text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RKInput
                    label="First name"
                    required
                    {...register(`assistants.${index}.firstName`)}
                  />
                  <RKInput
                    label="Last name"
                    required
                    {...register(`assistants.${index}.lastName`)}
                  />
                  
                  <RKInput
                    label="Date of birth"
                    hint="dd/mm/yyyy"
                    type="date"
                    required
                    {...register(`assistants.${index}.dob`)}
                  />
                  <RKSelect
                    label="Role"
                    required
                    options={[
                      { value: "", label: "Select role" },
                      { value: "Assistant", label: "Assistant" },
                      { value: "Co-childminder", label: "Co-childminder" }
                    ]}
                    {...register(`assistants.${index}.role`)}
                  />
                  
                  <RKInput
                    label="Email address"
                    type="email"
                    required
                    {...register(`assistants.${index}.email`)}
                  />
                  <RKInput
                    label="Mobile number"
                    type="tel"
                    required
                    {...register(`assistants.${index}.phone`)}
                  />
                </div>
              </div>
            ))}
            
            <RKButton
              type="button"
              variant="secondary"
              onClick={addAssistant}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add person
            </RKButton>
          </div>
        </div>
      )}

      {/* Capacity Guidance Info Box */}
      <RKInfoBox type="info" title="Your Maximum Capacity">
        <p className="text-sm mb-2">
          Based on {capacityRatios.totalAdults} adult{capacityRatios.totalAdults > 1 ? "s" : ""}, these are your standard ratios (subject to Ofsted approval):
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          {guidanceText.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </RKInfoBox>

      {/* Real-time Capacity Validation */}
      {(proposedUnder1 > 0 || proposedUnder5 > 0 || proposed5to8 > 0 || proposed8plus > 0) && (
        <div className="space-y-3">
          {validation.isValid && validation.warnings.length === 0 && (
            <RKInfoBox type="success" title="Your proposed numbers are within limits">
              Total under 5: {validation.totalUnder5} of {capacityRatios.maxUnder5} | 
              Total under 8: {validation.totalUnder8} of {capacityRatios.maxUnder8}
            </RKInfoBox>
          )}

          {validation.warnings.length > 0 && validation.isValid && (
            <RKInfoBox type="warning" title="Notice">
              <ul className="text-sm space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </RKInfoBox>
          )}

          {validation.errors.length > 0 && (
            <RKInfoBox type="error" title="Capacity limits exceeded">
              <ul className="text-sm space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </RKInfoBox>
          )}
        </div>
      )}

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Proposed Numbers of Children</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RKInput
          label="Children under 1 year"
          type="number"
          widthClass="10"
          min={0}
          max={capacityRatios.maxUnder1}
          hint={`Maximum: ${capacityRatios.maxUnder1}`}
          {...register("proposedUnder1", { valueAsNumber: true })}
        />
        <RKInput
          label="Children aged 1-5 years"
          type="number"
          widthClass="10"
          min={0}
          hint="Not including children under 1"
          {...register("proposedUnder5", { valueAsNumber: true })}
        />
        <RKInput
          label="Children aged 5-8 years"
          type="number"
          widthClass="10"
          min={0}
          {...register("proposed5to8", { valueAsNumber: true })}
        />
        <RKInput
          label="Children aged 8+ years"
          type="number"
          widthClass="10"
          min={0}
          {...register("proposed8plus", { valueAsNumber: true })}
        />
      </div>

      <div className="rk-divider" />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Childcare Times</h3>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium text-rk-text">
          When will you provide childcare?<span className="text-rk-error ml-1">*</span>
        </label>
        <p className="text-sm text-rk-text-light mb-3">Select all that apply</p>
        
        {[
          { value: "Weekdays", label: "Weekdays (Monday - Friday)" },
          { value: "Weekends", label: "Weekends" },
          { value: "Before School", label: "Before School" },
          { value: "After School", label: "After School" },
          { value: "School Holidays", label: "School Holidays" },
        ].map((option) => (
          <RKCheckbox
            key={option.value}
            name={`childcareTimes-${option.value}`}
            label={option.label}
            checked={(watch("childcareTimes") || []).includes(option.value)}
            onChange={(checked) => {
              const current = watch("childcareTimes") || [];
              if (checked) {
                setValue("childcareTimes", [...current, option.value]);
              } else {
                setValue("childcareTimes", current.filter((v: string) => v !== option.value));
              }
            }}
          />
        ))}
      </div>

      <RKRadio
        legend="Will you be looking after children overnight?"
        hint="This requires specific approval and potentially different premises requirements."
        required
        name="overnightCare"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={watch("overnightCare") || ""}
        onChange={(value) => setValue("overnightCare", value as "Yes" | "No")}
      />
    </div>
  );
};
