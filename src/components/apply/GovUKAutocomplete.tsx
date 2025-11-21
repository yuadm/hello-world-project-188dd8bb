import { cn } from "@/lib/utils";
import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface GovUKAutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export const GovUKAutocomplete = forwardRef<HTMLInputElement, GovUKAutocompleteProps>(
  ({ label, hint, error, required, options, value, onChange, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value || "");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    useEffect(() => {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }, [inputValue, options]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      onChange?.(newValue);
    };

    const handleOptionClick = (option: string) => {
      setInputValue(option);
      setIsOpen(false);
      onChange?.(option);
    };

    return (
      <div className="space-y-2" ref={containerRef}>
        <label className="block text-base font-bold text-foreground">
          {label}
          {required && <span className="text-[hsl(var(--govuk-red))] font-bold ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-[hsl(var(--govuk-text-secondary))]">{hint}</span>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className={cn(
              "w-full border-2 border-[hsl(var(--govuk-black))] p-2 pr-10 rounded-none text-base leading-normal box-border focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--govuk-focus-yellow))] focus:ring-offset-0 focus:shadow-[inset_0_0_0_2px_hsl(var(--govuk-black))]",
              error && "border-[hsl(var(--govuk-red))]",
              className
            )}
            {...props}
          />
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 pointer-events-none" />
          
          {isOpen && filteredOptions.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border-2 border-[hsl(var(--govuk-black))] shadow-lg">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="px-3 py-2 cursor-pointer hover:bg-[hsl(var(--govuk-grey-background))] text-base"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
          
          {isOpen && filteredOptions.length === 0 && inputValue && (
            <div className="absolute z-50 w-full mt-1 p-3 bg-white border-2 border-[hsl(var(--govuk-black))] shadow-lg text-sm text-[hsl(var(--govuk-text-secondary))]">
              No matches found
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-[hsl(var(--govuk-red))]">{error}</p>
        )}
      </div>
    );
  }
);

GovUKAutocomplete.displayName = "GovUKAutocomplete";
