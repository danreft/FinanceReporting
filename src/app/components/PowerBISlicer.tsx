interface SlicerProps {
  title: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  type?: 'dropdown' | 'list';
}

export default function PowerBISlicer({ title, value, options, onChange, type = 'dropdown' }: SlicerProps) {
  if (type === 'list') {
    return (
      <div className="bg-white border border-[#CFD5D0] p-3">
        <div className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{title}</div>
        <div className="space-y-1">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-2 py-1 text-sm cursor-pointer transition-colors ${
                value === option.value
                  ? 'bg-[#006637] text-white'
                  : 'text-[#1A1A1A] hover:bg-[#E6EEE7]'
              }`}
              style={{ fontFamily: 'Source Sans 3, sans-serif' }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#CFD5D0] p-3">
      <div className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{title}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-sm border border-[#CFD5D0] bg-white focus:outline-none focus:border-[#006637]"
        style={{ fontFamily: 'Source Sans 3, sans-serif' }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
