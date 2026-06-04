'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { format, startOfDay, endOfDay, subDays, startOfMonth } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

function prevM(year: number, month: number) {
  return month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 };
}
function nextM(year: number, month: number) {
  return month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 };
}

interface DateCustomProps {
  dateRange: [Date | null, Date | null];
  handleDateChange: (range: [string, string]) => void;
  className?: string;
  placeholder?: string;
  aligned?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const PRESETS = [
  { label: 'Today', fn: () => [new Date(), new Date()] as [Date, Date] },
  { label: 'Yesterday', fn: () => { const d = subDays(new Date(), 1); return [d, d] as [Date, Date]; } },
  { label: 'Last 7 days', fn: () => [subDays(new Date(), 6), new Date()] as [Date, Date] },
  { label: 'Last 30 days', fn: () => [subDays(new Date(), 29), new Date()] as [Date, Date] },
  { label: 'This month', fn: () => [startOfMonth(new Date()), new Date()] as [Date, Date] },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

interface MiniCalendarProps {
  viewYear: number;
  viewMonth: number;
  selecting: [Date | null, Date | null];
  hoverDate: Date | null;
  onDayClick: (d: Date) => void;
  onHover: (d: Date | null) => void;
  onPrev: () => void;
  onNext: () => void;
  showNav?: 'both' | 'prev' | 'next' | 'none';
}

function MiniCalendar({
  viewYear, viewMonth, selecting, hoverDate,
  onDayClick, onHover, onPrev, onNext, showNav = 'both',
}: MiniCalendarProps) {
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const [start, end] = selecting;

  const isInRange = (d: Date) => {
    const rangeEnd = end ?? hoverDate;
    if (!start || !rangeEnd) return false;
    const lo = start <= rangeEnd ? start : rangeEnd;
    const hi = start <= rangeEnd ? rangeEnd : start;
    return d > lo && d < hi;
  };

  const isStart = (d: Date) => !!(start && d.toDateString() === start.toDateString());
  const isEnd = (d: Date) => {
    const rangeEnd = end ?? hoverDate;
    return !!(rangeEnd && d.toDateString() === rangeEnd.toDateString());
  };
  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ];

  return (
    <div className="select-none w-full min-w-[220px]">
      <div className="flex items-center justify-between mb-3 px-1">
        {showNav === 'both' || showNav === 'prev' ? (
          <button type="button" onClick={onPrev} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
            <ChevronLeft size={15} />
          </button>
        ) : <div className="w-7" />}
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{MONTHS[viewMonth]} {viewYear}</span>
        {showNav === 'both' || showNav === 'next' ? (
          <button type="button" onClick={onNext} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400">
            <ChevronRight size={15} />
          </button>
        ) : <div className="w-7" />}
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const inRange = isInRange(d);
          const selStart = isStart(d);
          const selEnd = isEnd(d);
          const today = isToday(d);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick(d)}
              onMouseEnter={() => onHover(d)}
              onMouseLeave={() => onHover(null)}
              className={[
                'text-xs h-8 w-full rounded-md transition-all duration-100 font-medium',
                selStart || selEnd ? 'bg-pink-700 text-white shadow-sm' : '',
                inRange && !selStart && !selEnd ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-300 !rounded-none' : '',
                !selStart && !selEnd && !inRange ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300' : '',
                today && !selStart && !selEnd ? 'ring-1 ring-pink-400' : '',
              ].filter(Boolean).join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DateCustom: React.FC<DateCustomProps> = ({
  dateRange,
  handleDateChange,
  className,
  placeholder = 'Select date range',
  aligned = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<[Date | null, Date | null]>([null, null]);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [leftMonth, setLeftMonth] = useState(() => {
    const d = dateRange[0] ?? new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const ref = useRef<HTMLDivElement>(null);
  const right = nextM(leftMonth.year, leftMonth.month);

  // Detect mobile viewport
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close dropdown on outside click (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isMobile]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = isMobile && open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobile, open]);

  useEffect(() => {
    if (open) setSelecting([dateRange[0], dateRange[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDayClick = (d: Date) => {
    if (!selecting[0] || (selecting[0] && selecting[1])) {
      setSelecting([d, null]);
    } else {
      const [lo, hi] = d >= selecting[0] ? [selecting[0], d] : [d, selecting[0]];
      setSelecting([lo, hi]);
    }
  };

  const toIST = useCallback((d: Date, isEnd: boolean) => {
    const base = isEnd ? endOfDay(d) : startOfDay(d);
    const offset = 330;
    const localOffset = base.getTimezoneOffset();
    return new Date(base.getTime() + (offset + localOffset) * 60000)
      .toISOString()
      .replace('Z', '+05:30');
  }, []);

  const handleApply = () => {
    if (!selecting[0] || !selecting[1]) return;
    handleDateChange([toIST(selecting[0], false), toIST(selecting[1], true)]);
    setOpen(false);
  };

  const handlePreset = ([start, end]: [Date, Date]) => {
    setSelecting([start, end]);
    if (!isMobile) {
      handleDateChange([toIST(start, false), toIST(end, true)]);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDateChange(['', '']);
  };

  const displayValue = () => {
    if (!dateRange[0] || !dateRange[1]) return '';
    // Short format on small screens via text truncation
    return `${format(dateRange[0], 'dd MMM yy')} – ${format(dateRange[1], 'dd MMM yy')}`;
  };

  const hasValue = !!(dateRange[0] && dateRange[1]);

  const Footer = (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex-shrink-0 gap-2">
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate min-w-0">
        {selecting[0] ? (
          <>
            <span className="font-semibold">{format(selecting[0], 'dd MMM yy')}</span>
            {selecting[1] && (
              <> → <span className="font-semibold">{format(selecting[1], 'dd MMM yy')}</span></>
            )}
          </>
        ) : (
          <span className="text-gray-400 text-xs">Pick a start date</span>
        )}
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!selecting[0] || !selecting[1]}
          className="px-4 py-2 text-sm font-medium bg-pink-700 hover:bg-pink-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(!open)}
        className={`flex items-center gap-2 cursor-pointer ${
          className ??
          'w-full h-10 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-pink-400 dark:hover:border-pink-500 transition-colors focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500'
        }`}
      >
        <Calendar size={15} className="text-gray-400 flex-shrink-0" />
        <span className={`flex-1 text-sm truncate ${hasValue ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
          {displayValue() || placeholder}
        </span>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ──── MOBILE: bottom sheet ──── */}
      {isMobile && open && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          {/* Scrim */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Sheet */}
          <div className="relative bg-white dark:bg-gray-900 rounded-t-2xl flex flex-col max-h-[92dvh] shadow-2xl">
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 flex-shrink-0 border-b border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">Select Date Range</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            {/* Preset chips */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p.fn())}
                  className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-950/50 hover:border-pink-300 dark:hover:border-pink-700 hover:text-pink-700 dark:hover:text-pink-400 transition-colors bg-white dark:bg-gray-800"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {/* Single calendar */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <MiniCalendar
                viewYear={leftMonth.year}
                viewMonth={leftMonth.month}
                selecting={selecting}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onHover={setHoverDate}
                onPrev={() => setLeftMonth(prevM(leftMonth.year, leftMonth.month))}
                onNext={() => setLeftMonth(nextM(leftMonth.year, leftMonth.month))}
                showNav="both"
              />
            </div>
            {Footer}
          </div>
        </div>
      )}

      {/* ──── DESKTOP: positioned dropdown ──── */}
      {!isMobile && open && (
        <div
          className={`absolute top-full mt-2 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
            aligned ? 'right-0' : 'left-0'
          }`}
          style={{ width: 'max-content', maxWidth: 'calc(100vw - 32px)' }}
        >
          <div className="flex">
            {/* Presets sidebar */}
            <div className="w-36 border-r border-gray-100 dark:border-gray-700 p-3 flex flex-col gap-1 flex-shrink-0">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Quick select</p>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handlePreset(p.fn())}
                  className="text-left text-sm px-3 py-2 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/50 hover:text-pink-700 dark:hover:text-pink-400 text-gray-600 dark:text-gray-300 transition-colors font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
            {/* Dual calendars */}
            <div className="p-4 flex gap-5">
              <MiniCalendar
                viewYear={leftMonth.year}
                viewMonth={leftMonth.month}
                selecting={selecting}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onHover={setHoverDate}
                onPrev={() => setLeftMonth(prevM(leftMonth.year, leftMonth.month))}
                onNext={() => setLeftMonth(nextM(leftMonth.year, leftMonth.month))}
                showNav="prev"
              />
              <div className="w-px bg-gray-100 self-stretch" />
              <MiniCalendar
                viewYear={right.year}
                viewMonth={right.month}
                selecting={selecting}
                hoverDate={hoverDate}
                onDayClick={handleDayClick}
                onHover={setHoverDate}
                onPrev={() => setLeftMonth(prevM(leftMonth.year, leftMonth.month))}
                onNext={() => setLeftMonth(nextM(leftMonth.year, leftMonth.month))}
                showNav="next"
              />
            </div>
          </div>
          {Footer}
        </div>
      )}
    </div>
  );
};

export default DateCustom;
