import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow-sm hover:shadow-glow',
  secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-700',
  outline: 'bg-transparent border border-dark-700 hover:bg-dark-800 text-white',
  ghost: 'bg-transparent hover:bg-dark-800 text-dark-300 hover:text-white',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20',
  success: 'bg-accent-500/10 hover:bg-accent-500/20 text-accent-400 border border-accent-500/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

