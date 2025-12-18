import React, { useState, useEffect, useRef } from 'react';
import { format, parse, addMonths, addYears } from 'date-fns';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, disabled }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const fromYear = 1970;
  const toYear = new Date().getFullYear();

  useEffect(() => {
    const initialDate = value ? parse(value, 'MMM yyyy', new Date()) : new Date();
    if (!isNaN(initialDate.getTime())) {
      setCurrentDate(initialDate);
    }
  }, [value, isPickerOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleApply = () => {
    onChange(format(currentDate, 'MMM yyyy'));
    setIsPickerOpen(false);
  };

  const handleMonthChange = (increment: number) => {
    setCurrentDate(prev => addMonths(prev, increment));
  };

  const handleYearChange = (increment: number) => {
    setCurrentDate(prev => addYears(prev, increment));
  };

  return (
    <div className="relative w-full" ref={pickerRef}>
      <div className="relative group">
        <input
          type="text"
          readOnly
          className={`w-full p-3 pl-4 pr-10 border border-slate-200 rounded-xl text-sm transition-all outline-none
            ${!value ? 'text-slate-400 bg-slate-50' : 'text-slate-700 bg-white'} 
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-primary-400/50 hover:bg-white focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500/50'}
          `}
          value={value || 'Select a date'}
          onClick={() => !disabled && setIsPickerOpen(!isPickerOpen)}
          placeholder="Select a date"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary-500 transition-colors pointer-events-none">
          <ChevronDown size={16} className={`transition-transform duration-300 ${isPickerOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isPickerOpen && (
        <div className="absolute z-[50] mt-2 w-64 glass backdrop-blur-2xl rounded-2xl border border-white/40 shadow-premium overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-left">
          <div className="p-4 bg-white/40">
            <div className="flex items-center justify-between gap-4">
              {/* Month Picker */}
              <div className="flex-1 flex flex-col items-center gap-1 p-2 bg-white/50 rounded-xl border border-white/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleMonthChange(1)}
                  className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <ChevronUp size={16} />
                </button>
                <span className="font-display font-bold text-slate-700 text-xs uppercase tracking-wider h-6 flex items-center justify-center">
                  {format(currentDate, 'MMM')}
                </span>
                <button
                  type="button"
                  onClick={() => handleMonthChange(-1)}
                  className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Year Picker */}
              <div className="flex-1 flex flex-col items-center gap-1 p-2 bg-white/50 rounded-xl border border-white/20 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleYearChange(1)}
                  disabled={currentDate.getFullYear() >= toYear}
                  className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronUp size={16} />
                </button>
                <span className="font-display font-bold text-slate-700 text-xs tracking-widest h-6 flex items-center justify-center">
                  {format(currentDate, 'yyyy')}
                </span>
                <button
                  type="button"
                  onClick={() => handleYearChange(-1)}
                  disabled={currentDate.getFullYear() <= fromYear}
                  className="p-1 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-white/20 bg-white/20">
            <button
              onClick={handleApply}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-black/5"
            >
              Apply Selected Date
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

