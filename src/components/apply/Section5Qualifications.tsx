import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKRadio, RKInput, RKSectionTitle, RKInfoBox } from "./rk";

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
      <RKSectionTitle 
        title="Qualifications & Training"
        description="Tell us about your relevant qualifications and training."
      />

      <RKInfoBox type="info" title="Required Training Based on Your Age Groups">
        <ul className="list-disc list-inside text-sm space-y-1">
          {requires0to5 && <li>Paediatric First Aid (12-hour course) - Required</li>}
          {(requires5to7 || requires8plus) && !requires0to5 && <li>Appropriate First Aid - Required</li>}
          {(requires0to5 || requires5to7) && <li>Safeguarding Training - Required</li>}
          {requires5to7 && <li>EYFS/Childminding Course - Required</li>}
          {requires8plus && <li>Level 2 Qualification - Required</li>}
        </ul>
      </RKInfoBox>

      {/* First Aid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-rk-secondary font-fraunces">{firstAidLabel}</h3>
        <RKRadio
          legend={firstAidQuestion}
          required
          name="firstAid.completed"
          options={[
            { value: "Yes", label: "Yes" },
            { value: "No", label: "No" },
          ]}
          value={firstAidCompleted || ""}
          onChange={(value) => setValue("firstAid.completed", value as "Yes" | "No")}
        />

        {firstAidCompleted === "Yes" && (
          <div className="space-y-4">
            <RKInput
              label="Training provider"
              required
              {...register("firstAid.provider")}
            />
            <RKInput
              label="Completion date"
              type="date"
              required
              widthClass="10"
              {...register("firstAid.completionDate")}
            />
            <RKInput
              label="Certificate number"
              {...register("firstAid.certificateNumber")}
            />

            {isFirstAidExpired() && (
              <RKInfoBox type="warning">
                Your first aid certificate is more than 3 years old. You will need to renew it before your registration can be approved.
              </RKInfoBox>
            )}
          </div>
        )}

        {firstAidCompleted === "No" && (
          <RKInfoBox type="error">
            You must complete {requires0to5 ? "a 12-hour Paediatric First Aid course" : "an appropriate first aid qualification"} before your registration can be approved.
          </RKInfoBox>
        )}
      </div>

      {/* Safeguarding */}
      {(requires0to5 || requires5to7) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Safeguarding Training</h3>
          <RKRadio
            legend="Have you completed safeguarding children training?"
            required
            name="safeguarding.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("safeguarding.completed") || ""}
            onChange={(value) => setValue("safeguarding.completed", value as "Yes" | "No")}
          />

          {watch("safeguarding.completed") === "Yes" && (
            <div className="space-y-4">
              <RKInput label="Training provider" {...register("safeguarding.provider")} />
              <RKInput label="Completion date" type="date" widthClass="10" {...register("safeguarding.completionDate")} />
            </div>
          )}
        </div>
      )}

      {/* EYFS/Childminding Course */}
      {requires5to7 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-rk-secondary font-fraunces">EYFS/Childminding Course</h3>
          <RKRadio
            legend="Have you completed an EYFS or childminding-specific course?"
            required
            name="eyfsChildminding.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("eyfsChildminding.completed") || ""}
            onChange={(value) => setValue("eyfsChildminding.completed", value as "Yes" | "No")}
          />

          {watch("eyfsChildminding.completed") === "Yes" && (
            <div className="space-y-4">
              <RKInput label="Training provider" {...register("eyfsChildminding.provider")} />
              <RKInput label="Completion date" type="date" widthClass="10" {...register("eyfsChildminding.completionDate")} />
            </div>
          )}
        </div>
      )}

      {/* Level 2 Qualification */}
      {requires8plus && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Level 2 Qualification</h3>
          <RKRadio
            legend="Do you hold a Level 2 qualification in childcare or education?"
            required
            name="level2Qual.completed"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
            ]}
            value={watch("level2Qual.completed") || ""}
            onChange={(value) => setValue("level2Qual.completed", value as "Yes" | "No")}
          />

          {watch("level2Qual.completed") === "Yes" && (
            <div className="space-y-4">
              <RKInput label="Qualification name" {...register("level2Qual.provider")} />
              <RKInput label="Completion date" type="date" widthClass="10" {...register("level2Qual.completionDate")} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
