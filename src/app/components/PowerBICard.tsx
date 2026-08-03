interface PowerBICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function PowerBICard({ title, value, subtitle }: PowerBICardProps) {
  return (
    <div className="bg-white border border-[#CFD5D0] p-4 flex flex-col">
      <div className="text-xs text-[#3D654D] mb-2" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{title}</div>
      <div className="text-3xl font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Merriweather, serif' }}>{value}</div>
      {subtitle && <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{subtitle}</div>}
    </div>
  );
}
