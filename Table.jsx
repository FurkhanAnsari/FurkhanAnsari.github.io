export function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-dark-800/50">
      {children}
    </thead>
  );
}

export function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-dark-800">
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', onClick }) {
  return (
    <tr 
      className={`
        hover:bg-dark-800/30 transition-colors
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }) {
  return (
    <th className={`
      px-6 py-4 text-left text-xs font-semibold text-dark-300 uppercase tracking-wider
      ${className}
    `}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-sm text-dark-200 ${className}`}>
      {children}
    </td>
  );
}

