import { HouseholdFormData } from "@/pages/HouseholdForm";
import { RKInput, RKRadio, RKTextarea, RKButton, RKSectionTitle, RKInfoBox, RKRepeatingBlock } from "@/components/apply/rk";
import { Plus } from "lucide-react";

interface Props {
  formData: HouseholdFormData;
  setFormData: React.Dispatch<React.SetStateAction<HouseholdFormData>>;
  validationErrors?: Record<string, string>;
}

export function HouseholdFormSection2({ formData, setFormData, validationErrors = {} }: Props) {
  const addAddressHistory = () => {
    setFormData(prev => ({
      ...prev,
      addressHistory: [...prev.addressHistory, { address: "", moveIn: "", moveOut: "" }]
    }));
  };

  const removeAddressHistory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.filter((_, i) => i !== index)
    }));
  };

  const updateAddressHistory = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      addressHistory: prev.addressHistory.map((addr, i) =>
        i === index ? { ...addr, [field]: value } : addr
      )
    }));
  };

  const calculateAddressCoverage = () => {
    const today = new Date();
    const fiveYearsAgo = new Date(today);
    fiveYearsAgo.setFullYear(today.getFullYear() - 5);

    const periods = [];
    
    if (formData.homeMoveIn) {
      const moveInDate = new Date(formData.homeMoveIn);
      periods.push({ start: moveInDate, end: today });
    }

    formData.addressHistory.forEach(addr => {
      if (addr.moveIn && addr.moveOut) {
        const moveInDate = new Date(addr.moveIn);
        const moveOutDate = new Date(addr.moveOut);
        periods.push({ start: moveInDate, end: moveOutDate });
      }
    });

    if (periods.length === 0) return "incomplete";

    periods.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    const firstPeriod = periods[0];
    if (firstPeriod.start > fiveYearsAgo) return "incomplete";

    return "complete";
  };

  const coverageStatus = calculateAddressCoverage();

  return (
    <div>
      <RKSectionTitle 
        title="2. Your Address History"
        description="You must provide a complete history of all addresses where you have lived for the past 5 years. This is a mandatory requirement for background checks."
      />

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-4">Current Home Address</h3>
          <div className="space-y-4">
            <RKInput
              id="homeAddressLine1"
              label="Address line 1"
              required
              value={formData.homeAddressLine1}
              onChange={(e) => setFormData({ ...formData, homeAddressLine1: e.target.value })}
              error={validationErrors.homeAddressLine1}
            />
            
            <RKInput
              id="homeAddressLine2"
              label="Address line 2"
              hint="Optional"
              value={formData.homeAddressLine2}
              onChange={(e) => setFormData({ ...formData, homeAddressLine2: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RKInput
                id="homeTown"
                label="Town or city"
                required
                value={formData.homeTown}
                onChange={(e) => setFormData({ ...formData, homeTown: e.target.value })}
                error={validationErrors.homeTown}
              />
              
              <RKInput
                id="homePostcode"
                label="Postcode"
                required
                className="max-w-[200px]"
                value={formData.homePostcode}
                onChange={(e) => setFormData({ ...formData, homePostcode: e.target.value })}
                error={validationErrors.homePostcode}
              />
            </div>
            
            <RKInput
              id="homeMoveIn"
              label="When did you move into this address?"
              type="date"
              required
              className="max-w-[200px]"
              value={formData.homeMoveIn}
              onChange={(e) => setFormData({ ...formData, homeMoveIn: e.target.value })}
              error={validationErrors.homeMoveIn}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">5-Year Address History</h3>
          <p className="text-[#64748B] mb-4">
            Please add all previous addresses from the last 5 years. Your current address is already recorded above.
          </p>

          {coverageStatus === "incomplete" && (
            <RKInfoBox type="warning" className="mb-4">
              <strong>There are gaps in your 5-year address history.</strong> Please add all previous addresses to complete the 5-year requirement.
            </RKInfoBox>
          )}

          {coverageStatus === "complete" && (
            <RKInfoBox type="success" className="mb-4">
              Your 5-year address history is complete.
            </RKInfoBox>
          )}

          <div className="space-y-4 mb-4">
            {formData.addressHistory.map((addr, index) => (
              <RKRepeatingBlock
                key={index}
                title={`Previous Address ${index + 1}`}
                onRemove={() => removeAddressHistory(index)}
              >
                <RKTextarea
                  id={`historyAddress_${index}`}
                  label="Address"
                  required
                  rows={3}
                  value={addr.address}
                  onChange={(e) => updateAddressHistory(index, "address", e.target.value)}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <RKInput
                    id={`historyMoveIn_${index}`}
                    label="Move-in date"
                    type="date"
                    required
                    value={addr.moveIn}
                    onChange={(e) => updateAddressHistory(index, "moveIn", e.target.value)}
                  />
                  <RKInput
                    id={`historyMoveOut_${index}`}
                    label="Move-out date"
                    type="date"
                    required
                    value={addr.moveOut}
                    onChange={(e) => updateAddressHistory(index, "moveOut", e.target.value)}
                  />
                </div>
              </RKRepeatingBlock>
            ))}
          </div>

          <RKButton variant="secondary" onClick={addAddressHistory}>
            <Plus className="h-4 w-4 mr-2" />
            Add previous address
          </RKButton>
        </div>

        <div className="space-y-4">
          <RKRadio
            name="livedOutsideUK"
            legend="Have you lived outside the UK in the last 5 years?"
            required
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" }
            ]}
            value={formData.livedOutsideUK}
            onChange={(value) => setFormData({ ...formData, livedOutsideUK: value })}
            error={validationErrors.livedOutsideUK}
          />

          {formData.livedOutsideUK === "Yes" && (
            <RKInfoBox type="info">
              <p className="mb-3">
                If you have lived outside the UK, you must obtain a police check or 'Certificate of Good Conduct' from the relevant countries. You will need to provide these documents to Ready Kids.
              </p>
              <RKTextarea
                id="outsideUKDetails"
                label="Please provide details"
                hint="Include which countries, dates, and confirmation that you will provide the required documentation."
                required
                rows={4}
                value={formData.outsideUKDetails}
                onChange={(e) => setFormData({ ...formData, outsideUKDetails: e.target.value })}
              />
            </RKInfoBox>
          )}
        </div>
      </div>
    </div>
  );
}
