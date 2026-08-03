interface DataIntegrityProps {
  data: any;
}

export default function DataIntegrity({ data }: DataIntegrityProps) {
  const { dataIntegrityChecks } = data;

  return (
    <div className="p-4 space-y-4">
      {/* Data Integrity Check */}
      <div className="bg-white border border-[#CFD5D0] p-4">
        <div className="text-sm font-semibold text-[#006637] mb-3" style={{ fontFamily: 'Merriweather, serif' }}>
          Data Integrity Check
        </div>
        <div className="space-y-2">
          {dataIntegrityChecks.map((check: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-[#E6EEE7] last:border-0">
              <div className="flex-1">
                <div className="text-xs text-[#1A1A1A]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                  {check.check}
                </div>
                <div className="text-xs text-[#3D654D] mt-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                  {check.detail}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded font-semibold ml-3 ${
                check.status === 'Passed' ? 'bg-[#2F7641] text-white' :
                check.status === 'Needs Review' ? 'bg-[#56708F] text-white' :
                'bg-[#A33C1B] text-white'
              }`} style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                {check.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Notes */}
      <div className="bg-[#FFF9E6] border border-[#D5741C] p-3">
        <div className="text-xs font-semibold text-[#1A1A1A] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          Data Quality Notes
        </div>
        <div className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
          • RP+ program launched Q4 2025 - limited historical data available
          <br />
          • RP+ mapping partially complete - 4 downstream RPs pending verification
          <br />
          • 2 deals have manual referral code overrides
        </div>
      </div>
    </div>
  );
}
