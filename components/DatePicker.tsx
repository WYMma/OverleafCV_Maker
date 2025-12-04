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
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        readOnly
        className={`w-full p-2 border border-slate-200 rounded text-sm bg-white ${!value ? 'text-slate-400' : 'text-slate-900'} ${disabled ? 'cursor-not-allowed bg-slate-100' : 'cursor-pointer'}`}
        value={value || 'Select a date'}
        onClick={() => !disabled && setIsPickerOpen(!isPickerOpen)}
        placeholder="Select a date"
      />
      {isPickerOpen && (
        <div className="absolute z-10 mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
          <div className="flex items-center justify-center gap-4 p-4">
            {/* Month Picker */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => handleMonthChange(1)}
                className="p-1 disabled:opacity-50"
              >
                <ChevronUp size={18} />
              </button>
              <span className="font-semibold text-slate-700 w-24 text-center">
                {format(currentDate, 'MMMM')}
              </span>
              <button
                type="button"
                onClick={() => handleMonthChange(-1)}
                className="p-1 disabled:opacity-50"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Year Picker */}
            <div className="flex flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => handleYearChange(1)}
                disabled={currentDate.getFullYear() >= toYear}
                className="p-1 disabled:opacity-50"
              >
                <ChevronUp size={18} />
              </button>
              <span className="font-semibold text-slate-700 w-16 text-center">
                {format(currentDate, 'yyyy')}
              </span>
              <button
                type="button"
                onClick={() => handleYearChange(-1)}
                disabled={currentDate.getFullYear() <= fromYear}
                className="p-1 disabled:opacity-50"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
          <button
            onClick={handleApply}
            className="w-full p-1.5 bg-slate-800 text-white rounded-b text-xs hover:bg-slate-700"
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
};
