export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div 
      className={`
        rounded-2xl bg-dark-900 border border-dark-800
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', action }) {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-dark-800 ${className}`}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-white ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-dark-400 mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-t border-dark-800 ${className}`}>
      {children}
    </div>
  );
}

