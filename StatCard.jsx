import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'increase',
  subtitle,
  className = ''
}) {
  return (
    <div className={`
      p-6 rounded-2xl bg-dark-900 border border-dark-800
      card-hover
      ${className}
    `}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-dark-400">{title}</p>
          <p className="text-3xl font-bold text-white font-display">{value}</p>
          
          {(change || subtitle) && (
            <div className="flex items-center gap-2">
              {change && (
                <span className={`
                  inline-flex items-center gap-1 text-sm font-medium
                  ${changeType === 'increase' ? 'text-accent-400' : 'text-red-400'}
                `}>
                  {changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {change}
                </span>
              )}
              {subtitle && (
                <span className="text-sm text-dark-400">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="p-3 rounded-xl bg-primary-500/10">
            <Icon className="w-6 h-6 text-primary-500" />
          </div>
        )}
      </div>
    </div>
  );
}

