
import React from 'react';

interface SizeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled: boolean;
}

export const SizeSlider: React.FC<SizeSliderProps> = ({ value, onChange, min, max, disabled }) => {
  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <label htmlFor="size-slider" className="block text-sm font-medium text-slate-400 mb-1">
          Target Size
        </label>
        <p className="text-2xl font-bold text-white">{value} KB</p>
      </div>
      <input
        id="size-slider"
        type="range"
        min={min}
        max={max}
        step="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-500 disabled:opacity-50"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{min} KB</span>
        <span>{max} KB</span>
      </div>
    </div>
  );
};
