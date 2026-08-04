interface PowerBICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variance?: string;
  status?: 'positive' | 'neutral' | 'negative';
  tooltip?: string;
}

// Power BI implementation metadata:
// Recommended visual: Card or KPI visual.
// Approach: primary measure, optional prior-period/variance measures, subtitle, and conditional formatting.
// Interaction: report-page tooltip only; no expandable or editable card behavior.
export default function PowerBICard({ title, value, subtitle, variance, status, tooltip }: PowerBICardProps) {
  const statusClasses = {
    positive: 'text-[#2F7641]',
    neutral: 'text-[#3D654D]',
    negative: 'text-[#A33C1B]',
  };

  return (
    <div className="bg-white border border-[#CFD5D0] p-3 flex flex-col" title={tooltip} aria-label={tooltip ? `${title}: ${tooltip}` : title}>
      <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{title}</div>
      <div className="text-2xl font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{value}</div>
      {variance && <div className={`text-xs font-semibold mb-1 ${status ? statusClasses[status] : 'text-[#3D654D]'}`} style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{variance}</div>}
      {subtitle && <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>}
    </div>
  );
}
