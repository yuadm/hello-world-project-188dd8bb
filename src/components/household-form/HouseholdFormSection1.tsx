import { HouseholdFormData } from "@/pages/HouseholdForm";
import { RKInput, RKSelect, RKRadio, RKButton, RKSectionTitle, RKRepeatingBlock } from "@/components/apply/rk";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection1({ formData, setFormData, validationErrors = {} }: Props) {
  const addPreviousName = () => {
    setFormData(prev => ({
      ...prev,
      previousNames: [...prev.previousNames, { fullName: "", dateFrom: "", dateTo: "" }]
    }));
  };

  const removePreviousName = (index: number) => {
    setFormData(prev => ({
      ...prev,
      previousNames: prev.previousNames.filter((_, i) => i !== index)
    }));
  };

  const updatePreviousName = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      previousNames: prev.previousNames.map((name, i) =>
        i === index ? { ...name, [field]: value } : name
      )
    }));
  };

  return (
    <div>
      <RKSectionTitle 
        title="1. Your Personal Details"
        description="Please provide your personal information exactly as it appears on official documents."
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RKSelect
            id="title"
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            options={[
              { value: "", label: "Select title" },
              { value: "Mr", label: "Mr" },
              { value: "Mrs", label: "Mrs" },
              { value: "Miss", label: "Miss" },
              { value: "Ms", label: "Ms" },
              { value: "Mx", label: "Mx" },
              { value: "Dr", label: "Dr" },
              { value: "Other", label: "Other" }
            ]}
            error={validationErrors.title}
          />
          
          <div className="md:col-span-2">
            <RKInput
              id="firstName"
              label="First name(s)"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={validationErrors.firstName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RKInput
            id="middleNames"
            label="Middle name(s)"
            hint="Optional"
            value={formData.middleNames}
            onChange={(e) => setFormData({ ...formData, middleNames: e.target.value })}
          />
          
          <RKInput
            id="lastName"
            label="Last name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            error={validationErrors.lastName}
          />
        </div>

        <RKRadio
          name="otherNames"
          legend="Have you been known by any other names?"
          hint="This includes your name at birth if different, maiden names, or names changed by deed poll."
          required
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" }
          ]}
          value={formData.otherNames}
          onChange={(value) => setFormData({ ...formData, otherNames: value })}
        />

        {formData.otherNames === "Yes" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#0F172A]">Previous Names History</h3>
            {formData.previousNames.map((name, index) => (
              <RKRepeatingBlock
                key={index}
                title={`Previous Name ${index + 1}`}
                onRemove={() => removePreviousName(index)}
              >
                <RKInput
                  id={`prevNameFull_${index}`}
                  label="Full name"
                  required
                  value={name.fullName}
                  onChange={(e) => updatePreviousName(index, "fullName", e.target.value)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <RKInput
                    id={`prevNameStart_${index}`}
                    label="Date from"
                    type="date"
                    required
                    value={name.dateFrom}
                    onChange={(e) => updatePreviousName(index, "dateFrom", e.target.value)}
                  />
                  <RKInput
                    id={`prevNameEnd_${index}`}
                    label="Date to"
                    type="date"
                    required
                    value={name.dateTo}
                    onChange={(e) => updatePreviousName(index, "dateTo", e.target.value)}
                  />
                </div>
              </RKRepeatingBlock>
            ))}
            
            <RKButton variant="secondary" onClick={addPreviousName}>
              <Plus className="h-4 w-4 mr-2" />
              Add another name
            </RKButton>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RKInput
            id="dob"
            label="Date of birth"
            hint="For example, 31/03/1980"
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            error={validationErrors.dob}
          />
          
          <RKInput
            id="birthTown"
            label="Town or city of birth"
            required
            value={formData.birthTown}
            onChange={(e) => setFormData({ ...formData, birthTown: e.target.value })}
            error={validationErrors.birthTown}
          />
        </div>

        <RKRadio
          name="sex"
          legend="Sex"
          required
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" }
          ]}
          value={formData.sex}
          onChange={(value) => setFormData({ ...formData, sex: value })}
          error={validationErrors.sex}
        />

        <RKInput
          id="niNumber"
          label="National Insurance number"
          hint="It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
          required
          className="max-w-xs"
          value={formData.niNumber}
          onChange={(e) => setFormData({ ...formData, niNumber: e.target.value.toUpperCase().replace(/\s/g, "") })}
          error={validationErrors.niNumber}
        />
      </div>
    </div>
  );
}
