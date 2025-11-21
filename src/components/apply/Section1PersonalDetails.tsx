import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKInput } from "./GovUKInput";
import { GovUKSelect } from "./GovUKSelect";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKButton } from "./GovUKButton";
import { Plus, Trash2, AlertCircle } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section1PersonalDetails = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const otherNames = watch("otherNames");
  const previousNames = watch("previousNames") || [];
  const rightToWork = watch("rightToWork");
  const dob = watch("dob");

  // Calculate age from DOB
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = dob ? calculateAge(dob) : 0;
  const isUnder18 = age > 0 && age < 18;

  const addPreviousName = () => {
    setValue("previousNames", [...previousNames, { fullName: "", dateFrom: "", dateTo: "" }]);
  };

  const removePreviousName = (index: number) => {
    setValue("previousNames", previousNames.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">1. Personal Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GovUKSelect
          label="Title"
          required
          options={[
            { value: "", label: "Select title" },
            { value: "Mr", label: "Mr" },
            { value: "Mrs", label: "Mrs" },
            { value: "Miss", label: "Miss" },
            { value: "Ms", label: "Ms" },
            { value: "Mx", label: "Mx" },
            { value: "Dr", label: "Dr" },
            { value: "Other", label: "Other" },
          ]}
          {...register("title")}
        />

        <div className="md:col-span-2">
          <GovUKInput
            label="First name(s)"
            required
            {...register("firstName")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GovUKInput label="Middle name(s) (if any)" {...register("middleNames")} />
        <GovUKInput label="Last name" required {...register("lastName")} />
      </div>

      <GovUKRadio
        legend="Gender"
        required
        name="gender"
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
        ]}
        value={watch("gender") || ""}
        onChange={(value) => setValue("gender", value as "Male" | "Female")}
      />

      <GovUKRadio
        legend="Have you been known by any other names?"
        hint="This includes your name at birth if different, maiden names, or names changed by deed poll."
        required
        name="otherNames"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={otherNames || "No"}
        onChange={(value) => setValue("otherNames", value as "Yes" | "No")}
      />

      {otherNames === "Yes" && (
        <div className="mt-4 space-y-4 p-6 bg-[hsl(var(--govuk-grey-background))] border-l-4 border-[hsl(var(--govuk-grey-border))]">
          <h3 className="text-lg font-bold">Previous Names History</h3>
          {previousNames.map((_, index) => (
            <div key={index} className="space-y-4 p-4 bg-white border-l-4 border-[hsl(var(--govuk-grey-border))]">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Previous Name {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removePreviousName(index)}
                  className="text-[hsl(var(--govuk-red))] hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <GovUKInput
                label="Full name"
                required
                {...register(`previousNames.${index}.fullName`)}
              />
              <div className="grid grid-cols-2 gap-4">
                <GovUKInput
                  label="From date"
                  type="date"
                  required
                  {...register(`previousNames.${index}.dateFrom`)}
                />
                <GovUKInput
                  label="To date"
                  type="date"
                  required
                  {...register(`previousNames.${index}.dateTo`)}
                />
              </div>
            </div>
          ))}
          <GovUKButton
            type="button"
            variant="secondary"
            onClick={addPreviousName}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add another name
          </GovUKButton>
        </div>
      )}

      <GovUKInput
        label="Date of birth"
        hint="For example, 31 03 1980"
        type="date"
        required
        widthClass="10"
        {...register("dob")}
      />

      {isUnder18 && (
        <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-red))] bg-[hsl(var(--govuk-inset-red-bg))]">
          <p className="text-sm font-bold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            You must be at least 18 years old to register as a childminder.
          </p>
        </div>
      )}

      <GovUKSelect
        label="Do you have the right to work in the UK?"
        required
        options={[
          { value: "", label: "Select" },
          { value: "British Citizen", label: "Yes, I am a British Citizen" },
          { value: "Settled Status", label: "Yes, I have Settled/Pre-settled Status" },
          { value: "Visa", label: "Yes, I have a relevant Visa" },
          { value: "No", label: "No" },
        ]}
        {...register("rightToWork")}
      />

      {rightToWork === "No" && (
        <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-blue))] bg-[hsl(var(--govuk-inset-blue-bg))]">
          <p className="text-sm">
            We will need to verify your right to work status. If you do not have the right to work
            in the UK, we cannot proceed with your application.
          </p>
        </div>
      )}

      <h3 className="text-xl font-bold mt-8">Contact Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GovUKInput
          label="Email address"
          type="email"
          required
          {...register("email")}
        />
        <GovUKInput
          label="Mobile number"
          type="tel"
          required
          {...register("phone")}
        />
      </div>

      <GovUKInput
        label="National Insurance number"
        hint="It's on your National Insurance card, benefit letter, payslip or P60. For example, 'QQ 12 34 56 C'."
        required
        widthClass="10"
        {...register("niNumber")}
      />
    </div>
  );
};
