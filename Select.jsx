import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder = 'Select an option',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-dark-200">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl appearance-none
            bg-dark-800 border border-dark-700
            text-white
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        >
          <option value="" className="text-dark-400">{placeholder}</option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-dark-800 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;

