import { useEffect, useRef, useState } from 'react';

export interface TimeFrameValue {
  selectedMonths?: string[];
  useCustom?: boolean;
  customStart?: string;
  customEnd?: string;
}

interface TimeFrameSlicerProps {
  value: TimeFrameValue;
  onChange: (value: TimeFrameValue) => void;
}

interface QuarterNode {
  quarter: string;
  label: string;
  months: string[];
}

interface YearNode {
  year: string;
  quarters: QuarterNode[];
}

const monthLabel = (period: string) => {
  const [year, month] = period.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const buildTree = (): YearNode[] => {
  const allMonths = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
    '2026-01', '2026-02', '2026-03',
  ];
  const years: Record<string, Record<string, string[]>> = {};
  allMonths.forEach((month) => {
    const [year, monthNum] = month.split('-');
    const quarter = `${year}-Q${Math.ceil(Number(monthNum) / 3)}`;
    years[year] = years[year] ?? {};
    years[year][quarter] = years[year][quarter] ?? [];
    years[year][quarter].push(month);
  });
  return Object.entries(years).map(([year, quarters]) => ({
    year,
    quarters: Object.entries(quarters).map(([quarter, months]) => ({
      quarter,
      label: quarter.replace('-', ' '),
      months,
    })),
  }));
};

const TREE = buildTree();

const inputClass = 'w-full px-2 py-1 text-sm border border-[#CFD5D0] bg-white focus:outline-none focus:border-[#006637]';
const inputStyle = { fontFamily: 'Source Sans 3, sans-serif' } as const;

const TriStateCheckbox = ({ checked, indeterminate, onChange }: { checked: boolean; indeterminate: boolean; onChange: () => void }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={(el) => {
        ref.current = el;
        if (el) el.indeterminate = indeterminate;
      }}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-3.5 w-3.5 accent-[#006637] cursor-pointer"
    />
  );
};

export default function TimeFrameSlicer({ value, onChange }: TimeFrameSlicerProps) {
  const selectedMonths = value?.selectedMonths ?? [];
  const [open, setOpen] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set([TREE[TREE.length - 1]?.year]));
  const [expandedQuarters, setExpandedQuarters] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggleExpandedYear = (year: string) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year); else next.add(year);
      return next;
    });
  };

  const toggleExpandedQuarter = (quarter: string) => {
    setExpandedQuarters((prev) => {
      const next = new Set(prev);
      if (next.has(quarter)) next.delete(quarter); else next.add(quarter);
      return next;
    });
  };

  const setMonths = (months: string[], select: boolean) => {
    const set = new Set(selectedMonths);
    months.forEach((month) => (select ? set.add(month) : set.delete(month)));
    onChange({ ...value, selectedMonths: Array.from(set) });
  };

  const yearMonths = (yearNode: YearNode) => yearNode.quarters.flatMap((q) => q.months);
  const countSelected = (months: string[]) => months.filter((m) => selectedMonths.includes(m)).length;

  const toggleYear = (yearNode: YearNode) => {
    const months = yearMonths(yearNode);
    const selectedCount = countSelected(months);
    setMonths(months, selectedCount !== months.length);
  };

  const toggleQuarter = (quarterNode: QuarterNode) => {
    const selectedCount = countSelected(quarterNode.months);
    setMonths(quarterNode.months, selectedCount !== quarterNode.months.length);
  };

  const toggleMonth = (month: string) => {
    setMonths([month], !selectedMonths.includes(month));
  };

  const clearAll = () => {
    onChange({ selectedMonths: [], useCustom: false, customStart: undefined, customEnd: undefined });
  };

  const totalSelectedLabel = value?.useCustom
    ? 'Custom range'
    : selectedMonths.length === 0
      ? 'All Time'
      : `${selectedMonths.length} month${selectedMonths.length === 1 ? '' : 's'} selected`;

  return (
    <div className="bg-white border border-[#CFD5D0] p-3 relative" ref={containerRef}>
      <div className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        Time Frame
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-2 py-1 text-sm border border-[#CFD5D0] bg-white focus:outline-none focus:border-[#006637]"
        style={{ fontFamily: 'Source Sans 3, sans-serif' }}
      >
        <span className="text-[#1A1A1A]">{totalSelectedLabel}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="#3D654D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 mt-1 bg-white border border-[#9FAEA4] shadow-md z-30 p-2"
          style={{ top: '100%' }}
        >
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{totalSelectedLabel}</span>
            <button
              onClick={clearAll}
              className="text-xs text-[#006637] hover:underline"
              style={{ fontFamily: 'Source Sans 3, sans-serif' }}
            >
              Clear
            </button>
          </div>

          <div className="border border-[#CFD5D0] max-h-48 overflow-y-auto">
            {TREE.map((yearNode) => {
              const allYearMonths = yearMonths(yearNode);
              const yearSelectedCount = countSelected(allYearMonths);
              const yearExpanded = expandedYears.has(yearNode.year);

              return (
                <div key={yearNode.year}>
                  <div className="flex items-center gap-1.5 px-2 py-1 hover:bg-[#F5F7F6]">
                    <button onClick={() => toggleExpandedYear(yearNode.year)} className="text-[#3D654D] w-3 text-xs">
                      {yearExpanded ? '▾' : '▸'}
                    </button>
                    <TriStateCheckbox
                      checked={yearSelectedCount === allYearMonths.length}
                      indeterminate={yearSelectedCount > 0 && yearSelectedCount < allYearMonths.length}
                      onChange={() => toggleYear(yearNode)}
                    />
                    <span className="text-sm text-[#1A1A1A] font-semibold" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                      {yearNode.year}
                    </span>
                  </div>

                  {yearExpanded && yearNode.quarters.map((quarterNode) => {
                    const quarterSelectedCount = countSelected(quarterNode.months);
                    const quarterExpanded = expandedQuarters.has(quarterNode.quarter);

                    return (
                      <div key={quarterNode.quarter}>
                        <div className="flex items-center gap-1.5 px-2 py-1 pl-6 hover:bg-[#F5F7F6]">
                          <button onClick={() => toggleExpandedQuarter(quarterNode.quarter)} className="text-[#3D654D] w-3 text-xs">
                            {quarterExpanded ? '▾' : '▸'}
                          </button>
                          <TriStateCheckbox
                            checked={quarterSelectedCount === quarterNode.months.length}
                            indeterminate={quarterSelectedCount > 0 && quarterSelectedCount < quarterNode.months.length}
                            onChange={() => toggleQuarter(quarterNode)}
                          />
                          <span className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                            {quarterNode.label}
                          </span>
                        </div>

                        {quarterExpanded && quarterNode.months.map((month) => (
                          <div key={month} className="flex items-center gap-1.5 px-2 py-1 pl-11 hover:bg-[#F5F7F6]">
                            <TriStateCheckbox
                              checked={selectedMonths.includes(month)}
                              indeterminate={false}
                              onChange={() => toggleMonth(month)}
                            />
                            <span className="text-sm text-[#1A1A1A]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
                              {monthLabel(month)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <label className="flex items-center gap-1.5 mt-2 px-1 cursor-pointer">
            <input
              type="checkbox"
              checked={value?.useCustom ?? false}
              onChange={(e) => onChange({ ...value, useCustom: e.target.checked })}
              className="h-3.5 w-3.5 accent-[#006637] cursor-pointer"
            />
            <span className="text-xs text-[#1A1A1A]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Custom Range</span>
          </label>

          {value?.useCustom && (
            <div className="mt-2 px-1 space-y-2">
              <div>
                <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>Start</div>
                <input
                  type="date"
                  value={value.customStart ?? ''}
                  onChange={(e) => onChange({ ...value, customStart: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div>
                <div className="text-xs text-[#3D654D] mb-1" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>End</div>
                <input
                  type="date"
                  value={value.customEnd ?? ''}
                  onChange={(e) => onChange({ ...value, customEnd: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
