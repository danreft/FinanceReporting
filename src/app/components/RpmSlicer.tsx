import { useEffect, useRef, useState } from 'react';
import { associateRpmsByRpm } from '../data/mockDataV3Updated';

export interface RpmFilterValue {
  rpm: string;
  associate?: string;
}

interface RpmSlicerProps {
  value: RpmFilterValue;
  onChange: (value: RpmFilterValue) => void;
}

const RPM_OPTIONS = [
  { value: 'clayton_mason', label: 'Clayton Mason' },
  { value: 'dave_stamp', label: 'Dave Stamp' },
  { value: 'james_st_peter', label: 'James St. Peter' },
  { value: 'max_davis', label: 'Max Davis' },
  { value: 'nicolas_post', label: 'Nicolas Post' },
  { value: 'reagan_gross', label: 'Reagan Gross' },
];

const toSlug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '');

export default function RpmSlicer({ value, onChange }: RpmSlicerProps) {
  const rpm = value?.rpm ?? 'all';
  const associate = value?.associate ?? 'all';
  const [open, setOpen] = useState(false);
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

  const rpmLabel = RPM_OPTIONS.find((option) => option.value === rpm)?.label;
  const associateOptions = rpmLabel ? associateRpmsByRpm[rpmLabel] ?? [] : [];
  const associateLabel = associate !== 'all' ? associateOptions.find((name) => toSlug(name) === associate) : undefined;

  const triggerLabel = !rpmLabel
    ? 'All'
    : associateLabel
      ? `${rpmLabel} – ${associateLabel}`
      : rpmLabel;

  const selectRpm = (nextRpm: string) => {
    onChange({ rpm: nextRpm, associate: 'all' });
  };

  const selectAssociate = (nextAssociate: string) => {
    onChange({ rpm, associate: nextAssociate });
  };

  const clearAll = () => {
    onChange({ rpm: 'all', associate: 'all' });
  };

  return (
    <div className="bg-white border border-[#CFD5D0] p-3 relative" ref={containerRef}>
      <div className="text-xs font-semibold text-[#1A1A1A] mb-2 uppercase tracking-wide" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>
        RPM
      </div>

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-2 py-1 text-sm border border-[#CFD5D0] bg-white focus:outline-none focus:border-[#006637]"
        style={{ fontFamily: 'Source Sans 3, sans-serif' }}
      >
        <span className="text-[#1A1A1A] truncate">{triggerLabel}</span>
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
            <span className="text-xs text-[#3D654D]" style={{ fontFamily: 'Source Sans 3, sans-serif' }}>{triggerLabel}</span>
            <button
              onClick={clearAll}
              className="text-xs text-[#006637] hover:underline"
              style={{ fontFamily: 'Source Sans 3, sans-serif' }}
            >
              Clear
            </button>
          </div>

          <div className="border border-[#CFD5D0] max-h-48 overflow-y-auto">
            <div
              onClick={() => selectRpm('all')}
              className={`px-2 py-1 text-sm cursor-pointer ${rpm === 'all' ? 'bg-[#E6EEE7] font-semibold text-[#006637]' : 'text-[#1A1A1A] hover:bg-[#F5F7F6]'}`}
              style={{ fontFamily: 'Source Sans 3, sans-serif' }}
            >
              All
            </div>

            {RPM_OPTIONS.map((option) => {
              const isSelectedRpm = rpm === option.value;
              const options = associateRpmsByRpm[option.label] ?? [];

              return (
                <div key={option.value}>
                  <div
                    onClick={() => selectRpm(option.value)}
                    className={`px-2 py-1 text-sm cursor-pointer ${isSelectedRpm ? 'bg-[#E6EEE7] font-semibold text-[#006637]' : 'text-[#1A1A1A] hover:bg-[#F5F7F6]'}`}
                    style={{ fontFamily: 'Source Sans 3, sans-serif' }}
                  >
                    {option.label}
                  </div>

                  {isSelectedRpm && options.length > 0 && (
                    <div>
                      <div
                        onClick={() => selectAssociate('all')}
                        className={`px-2 py-1 pl-6 text-sm cursor-pointer ${associate === 'all' ? 'bg-[#E6EEE7] font-semibold text-[#006637]' : 'text-[#1A1A1A] hover:bg-[#F5F7F6]'}`}
                        style={{ fontFamily: 'Source Sans 3, sans-serif' }}
                      >
                        All Associate RPMs
                      </div>
                      {options.map((name) => {
                        const slug = toSlug(name);
                        const isSelectedAssociate = associate === slug;
                        return (
                          <div
                            key={name}
                            onClick={() => selectAssociate(slug)}
                            className={`px-2 py-1 pl-6 text-sm cursor-pointer ${isSelectedAssociate ? 'bg-[#E6EEE7] font-semibold text-[#006637]' : 'text-[#1A1A1A] hover:bg-[#F5F7F6]'}`}
                            style={{ fontFamily: 'Source Sans 3, sans-serif' }}
                          >
                            {name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
