import { cn } from "@/lib/utils";
import { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface RKAutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export const RKAutocomplete = forwardRef<HTMLInputElement, RKAutocompleteProps>(
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
      <div className="space-y-1.5" ref={containerRef}>
        <label className="block text-sm font-medium text-rk-text">
          {label}
          {required && <span className="text-rk-error ml-1">*</span>}
        </label>
        {hint && (
          <span className="block text-sm text-rk-text-light">{hint}</span>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            className={cn(
              "w-full px-4 py-3 bg-white border-2 border-rk-gray-300 rounded-xl text-base text-rk-text placeholder:text-rk-text-light transition-all duration-200 pr-10",
              "hover:border-rk-gray-400 focus:outline-none focus:border-rk-primary focus:shadow-[0_0_0_3px_hsl(163_50%_38%/0.15)]",
              error && "border-rk-error bg-red-50",
              className
            )}
            {...props}
          />
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rk-text-light pointer-events-none" />
          
          {isOpen && filteredOptions.length > 0 && (
            <ul className="absolute z-50 w-full mt-2 max-h-60 overflow-auto bg-white border-2 border-rk-gray-300 rounded-xl shadow-lg">
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="px-4 py-3 cursor-pointer hover:bg-rk-primary-light text-base first:rounded-t-lg last:rounded-b-lg"
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
          
          {isOpen && filteredOptions.length === 0 && inputValue && (
            <div className="absolute z-50 w-full mt-2 p-4 bg-white border-2 border-rk-gray-300 rounded-xl shadow-lg text-sm text-rk-text-light">
              No matches found
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-rk-error mt-1">{error}</p>
        )}
      </div>
    );
  }
);

RKAutocomplete.displayName = "RKAutocomplete";
