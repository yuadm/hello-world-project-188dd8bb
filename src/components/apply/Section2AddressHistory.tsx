import { UseFormReturn } from "react-hook-form";
import { ChildminderApplication } from "@/types/childminder";
import { RKInput, RKRadio, RKButton, RKTextarea, RKSelect, RKSectionTitle, RKInfoBox } from "./rk";
import { useState, useMemo } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { 
  calculateAddressHistoryCoverage, 
  formatDateRange, 
  daysBetween 
} from "@/lib/addressHistoryCalculator";
import { 
  lookupAddressesByPostcode, 
  validatePostcode, 
  formatPostcode,
  type AddressListItem 
} from "@/lib/postcodeService";
import { toast } from "sonner";

interface Props {
  form: UseFormReturn<Partial<ChildminderApplication>>;
}

export const Section2AddressHistory = ({ form }: Props) => {
  const { register, watch, setValue } = form;
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [isLookingUpPostcode, setIsLookingUpPostcode] = useState(false);
  const [addressList, setAddressList] = useState<AddressListItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const addressHistory = watch("addressHistory") || [];
  const livedOutsideUK = watch("livedOutsideUK");
  const militaryBase = watch("militaryBase");
  const homeMoveIn = watch("homeMoveIn");
  const homePostcode = watch("homePostcode");

  // Calculate address history coverage
  const coverage = useMemo(() => {
    if (!homeMoveIn) return null;
    
    return calculateAddressHistoryCoverage(
      { moveIn: homeMoveIn },
      addressHistory
    );
  }, [homeMoveIn, addressHistory]);

  const addAddressHistory = () => {
    setValue("addressHistory", [
      ...addressHistory,
      {
        address: { line1: "", line2: "", town: "", postcode: "" },
        moveIn: "",
        moveOut: "",
      },
    ]);
  };

  const removeAddressHistory = (index: number) => {
    setValue("addressHistory", addressHistory.filter((_, i) => i !== index));
  };

  const handlePostcodeLookup = async () => {
    if (!homePostcode) {
      toast.error("Please enter a postcode first");
      return;
    }

    if (!validatePostcode(homePostcode)) {
      toast.error("Please enter a valid UK postcode");
      return;
    }

    setIsLookingUpPostcode(true);
    setAddressList([]);
    setSelectedAddress("");

    try {
      const addresses = await lookupAddressesByPostcode(homePostcode);
      
      if (addresses.length > 0) {
        setAddressList(addresses);
        setValue("homePostcode", formatPostcode(homePostcode));
        toast.success(`Found ${addresses.length} address${addresses.length > 1 ? 'es' : ''}. Please select yours.`);
      } else {
        toast.error("No addresses found for this postcode. Please enter manually.");
        setShowManualAddress(true);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to lookup addresses");
      setShowManualAddress(true);
    } finally {
      setIsLookingUpPostcode(false);
    }
  };

  const handleAddressSelect = (value: string) => {
    setSelectedAddress(value);
    
    if (value && value !== "") {
      const address = addressList[parseInt(value)];
      if (address) {
        setValue("homeAddress.line1", address.line1);
        setValue("homeAddress.line2", address.line2);
        setValue("homeAddress.town", address.town);
        setValue("homeAddress.postcode", formatPostcode(homePostcode));
        toast.success("Address selected and filled in!");
      }
    }
  };

  return (
    <div className="space-y-8">
      <RKSectionTitle 
        title="Address History"
        description="We need your current and previous addresses for the last 5 years."
      />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">Current Home Address</h3>
      <p className="text-sm text-rk-text-light">This is the address where you currently live.</p>

      <div>
        <RKInput
          label="Postcode"
          required
          widthClass="10"
          placeholder="e.g. SW1A 1AA"
          {...register("homePostcode")}
        />
        <div className="mt-3 flex gap-3 flex-wrap">
          <RKButton
            type="button"
            variant="secondary"
            onClick={handlePostcodeLookup}
            disabled={isLookingUpPostcode || !homePostcode}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isLookingUpPostcode ? "Looking up..." : "Find address"}
          </RKButton>
          <button
            type="button"
            onClick={() => {
              setShowManualAddress(!showManualAddress);
              setAddressList([]);
              setSelectedAddress("");
            }}
            className="underline text-rk-primary hover:text-rk-primary-dark text-sm"
          >
            {showManualAddress ? "Use postcode lookup" : "Enter address manually"}
          </button>
        </div>
      </div>

      {addressList.length > 0 && !showManualAddress && (
        <RKSelect
          label="Select your address"
          hint="Choose your address from the list"
          options={[
            { value: "", label: "Please select an address" },
            ...addressList.map((addr, index) => ({
              value: index.toString(),
              label: addr.formatted,
            })),
          ]}
          value={selectedAddress}
          onChange={(e) => handleAddressSelect(e.target.value)}
          required
        />
      )}

      {(showManualAddress || selectedAddress) && (
        <div className="space-y-4">
          <RKInput
            label="Address line 1"
            required
            {...register("homeAddress.line1")}
          />
          <RKInput label="Address line 2" {...register("homeAddress.line2")} />
          <RKInput
            label="Town or city"
            required
            widthClass="20"
            {...register("homeAddress.town")}
          />
          <RKInput
            label="Postcode"
            required
            widthClass="10"
            {...register("homeAddress.postcode")}
          />
        </div>
      )}

      <RKInput
        label="When did you move into this address?"
        type="date"
        required
        widthClass="10"
        {...register("homeMoveIn")}
      />

      <div className="rk-divider" />

      <h3 className="text-xl font-bold text-rk-secondary font-fraunces">5-Year Address History</h3>
      <p className="text-sm text-rk-text-light mb-6">
        You must provide a complete history of all addresses where you have lived for the past 5
        years. This is required for background checks.
      </p>

      {/* Coverage Status Display */}
      {coverage && (
        <div className="mb-6">
          {coverage.isCovered ? (
            <RKInfoBox type="success" title="Your address history covers the last 5 years">
              Coverage: {Math.round(coverage.coveragePercentage)}% ({coverage.totalDaysCovered} of {coverage.requiredDays} days)
            </RKInfoBox>
          ) : (
            <div className="space-y-3">
              <RKInfoBox type="error" title="Incomplete address history">
                Coverage: {Math.round(coverage.coveragePercentage)}% ({coverage.totalDaysCovered} of {coverage.requiredDays} days)
              </RKInfoBox>

              {coverage.gaps.length > 0 && (
                <RKInfoBox type="info" title="Gaps detected in your address history">
                  <ul className="space-y-1 mt-2">
                    {coverage.gaps.map((gap, index) => (
                      <li key={index} className="text-sm">
                        • {formatDateRange(gap.start, gap.end)} ({daysBetween(gap.start, gap.end)} days)
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm mt-3 font-semibold">
                    You can either add previous addresses or explain them below.
                  </p>
                </RKInfoBox>
              )}
            </div>
          )}
        </div>
      )}

      {!homeMoveIn && (
        <RKInfoBox type="info">
          Please enter your current address move-in date above to calculate address history coverage.
        </RKInfoBox>
      )}

      {addressHistory.map((_, index) => (
        <div
          key={index}
          className="mb-6 p-5 bg-rk-bg-form border border-rk-border rounded-xl space-y-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-rk-text">Previous Address {index + 1}</h4>
            <button
              type="button"
              onClick={() => removeAddressHistory(index)}
              className="text-rk-error hover:text-rk-error/80 flex items-center gap-1 text-sm"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
          <RKInput
            label="Address line 1"
            {...register(`addressHistory.${index}.address.line1`)}
          />
          <RKInput label="Address line 2" {...register(`addressHistory.${index}.address.line2`)} />
          <RKInput label="Town or city" {...register(`addressHistory.${index}.address.town`)} />
          <RKInput label="Postcode" widthClass="10" {...register(`addressHistory.${index}.address.postcode`)} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RKInput label="Moved in" type="date" {...register(`addressHistory.${index}.moveIn`)} />
            <RKInput label="Moved out" type="date" {...register(`addressHistory.${index}.moveOut`)} />
          </div>
        </div>
      ))}

      <RKButton
        type="button"
        variant="secondary"
        onClick={addAddressHistory}
        className="flex items-center gap-2"
        disabled={coverage?.isCovered}
      >
        <Plus className="h-4 w-4" />
        {coverage?.isCovered ? "Address history complete" : "Add previous address"}
      </RKButton>

      <RKTextarea
        label="Explain any gaps in address history"
        hint="If there are gaps in your address history, please explain periods of travel, temporary accommodation, or other circumstances."
        rows={4}
        {...register("addressGaps")}
      />

      <div className="rk-divider" />

      <RKRadio
        legend="Have you lived outside the UK in the last 5 years?"
        required
        name="livedOutsideUK"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={livedOutsideUK || ""}
        onChange={(value) => setValue("livedOutsideUK", value as "Yes" | "No")}
      />

      {livedOutsideUK === "Yes" && (
        <RKInfoBox type="info">
          If you have lived outside the UK, you must obtain a police check or 'Certificate of
          Good Conduct' from the relevant countries. You will need to provide these documents to
          Ready Kids.
        </RKInfoBox>
      )}

      <RKRadio
        legend="Have you lived or worked on a British military base abroad in the last 5 years?"
        required
        name="militaryBase"
        options={[
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ]}
        value={militaryBase || ""}
        onChange={(value) => setValue("militaryBase", value as "Yes" | "No")}
      />

      {militaryBase === "Yes" && (
        <RKInfoBox type="info">
          We will arrange Ministry of Defence (MoD) checks on your behalf. You may need to
          complete additional forms.
        </RKInfoBox>
      )}
    </div>
  );
};
