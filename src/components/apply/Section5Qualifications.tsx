import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { GovUKRadio } from "./GovUKRadio";
import { GovUKInput } from "./GovUKInput";
import { AlertTriangle } from "lucide-react";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section5Qualifications = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const ageGroups = watch("ageGroups") || [];
  const firstAidCompleted = watch("firstAid.completed");
  const firstAidCompletionDate = watch("firstAid.completionDate");

  // Calculate if first aid is older than 3 years
  const isFirstAidExpired = (): boolean => {
    if (!firstAidCompletionDate) return false;
    const completionDate = new Date(firstAidCompletionDate);
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    return completionDate < threeYearsAgo;
  };

  const requires0to5 = ageGroups.includes("0-5");
  const requires5to7 = ageGroups.includes("5-7");
  const requires8plus = ageGroups.includes("8+");

  const firstAidLabel = requires0to5
    ? "Paediatric First Aid (PFA)"
    : "Appropriate First Aid";
  const firstAidQuestion = requires0to5
    ? "Have you completed a 12-hour Paediatric First Aid course?"
    : "Have you completed an appropriate first aid qualification?";

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-foreground">5. Qualifications & Training</h2>

      <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-blue))] bg-[hsl(var(--govuk-inset-blue-bg))]">
        <h3 className="text-base font-bold mb-2">Required Training Based on Your Age Groups</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          {requires0to5 && <li>Paediatric First Aid (12-hour course) - Required</li>}
          {(requires5to7 || requires8plus) && !requires0to5 && <li>Appropriate First Aid - Required</li>}
          {(requires0to5 || requires5to7) && <li>Safeguarding Training - Required</li>}
          {requires5to7 && <li>EYFS/Childminding Course - Required</li>}
          {requires8plus && <li>Level 2 Qualification - Required</li>}
        </ul>
      </div>

      {/* First Aid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold">{firstAidLabel}</h3>
        <GovUKRadio
          legend={firstAidQuestion}
          required
          name="firstAid.completed"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={firstAidCompleted || "No"}
          onChange={(value) => setValue("firstAid.completed", value as "Yes" | "No")}
        />

        {firstAidCompleted === "Yes" && (
          <div className="space-y-4">
            <GovUKInput
              label="Training provider"
              required
              {...register("firstAid.provider")}
            />
            <GovUKInput
              label="Completion date"
              type="date"
              required
              widthClass="10"
              {...register("firstAid.completionDate")}
            />
            <GovUKInput
              label="Certificate number"
              {...register("firstAid.certificateNumber")}
            />

            {isFirstAidExpired() && (
              <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-orange))] bg-[hsl(var(--govuk-inset-blue-bg))]">
                <p className="text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Your first aid certificate is more than 3 years old. You will need to renew it before your registration can be approved.
                </p>
              </div>
            )}
          </div>
        )}

        {firstAidCompleted === "No" && (
          <div className="p-4 border-l-[10px] border-[hsl(var(--govuk-red))] bg-[hsl(var(--govuk-inset-red-bg))]">
            <p className="text-sm font-bold">
              You must complete {requires0to5 ? "a 12-hour Paediatric First Aid course" : "an appropriate first aid qualification"} before your registration can be approved.
            </p>
          </div>
        )}
      </div>

      {/* Safeguarding */}
      {(requires0to5 || requires5to7) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Safeguarding Training</h3>
          <GovUKRadio
            legend="Have you completed safeguarding children training?"
            required
            name="safeguarding.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("safeguarding.completed") || "No"}
            onChange={(value) => setValue("safeguarding.completed", value as "Yes" | "No")}
          />

          {watch("safeguarding.completed") === "Yes" && (
            <div className="space-y-4">
              <GovUKInput label="Training provider" {...register("safeguarding.provider")} />
              <GovUKInput label="Completion date" type="date" widthClass="10" {...register("safeguarding.completionDate")} />
            </div>
          )}
        </div>
      )}

      {/* EYFS/Childminding Course */}
      {requires5to7 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">EYFS/Childminding Course</h3>
          <GovUKRadio
            legend="Have you completed an EYFS or childminding-specific course?"
            required
            name="eyfsChildminding.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("eyfsChildminding.completed") || "No"}
            onChange={(value) => setValue("eyfsChildminding.completed", value as "Yes" | "No")}
          />

          {watch("eyfsChildminding.completed") === "Yes" && (
            <div className="space-y-4">
              <GovUKInput label="Training provider" {...register("eyfsChildminding.provider")} />
              <GovUKInput label="Completion date" type="date" widthClass="10" {...register("eyfsChildminding.completionDate")} />
            </div>
          )}
        </div>
      )}

      {/* Level 2 Qualification */}
      {requires8plus && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Level 2 Qualification</h3>
          <GovUKRadio
            legend="Do you hold a Level 2 qualification in childcare or education?"
            required
            name="level2Qual.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("level2Qual.completed") || "No"}
            onChange={(value) => setValue("level2Qual.completed", value as "Yes" | "No")}
          />

          {watch("level2Qual.completed") === "Yes" && (
            <div className="space-y-4">
              <GovUKInput label="Qualification name" {...register("level2Qual.provider")} />
              <GovUKInput label="Completion date" type="date" widthClass="10" {...register("level2Qual.completionDate")} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
