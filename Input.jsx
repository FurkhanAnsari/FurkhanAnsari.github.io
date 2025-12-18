import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  error,
  icon: Icon,
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
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-dark-800 border border-dark-700
            text-white placeholder-dark-400
            focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

