const variants = {
  default: 'bg-dark-800 text-dark-200',
  primary: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
  success: 'bg-accent-500/10 text-accent-400 border border-accent-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
};

export default function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-lg
      text-xs font-medium
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}

