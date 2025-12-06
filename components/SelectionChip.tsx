import React from 'react';
import { Check } from 'lucide-react';

interface SelectionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export const SelectionChip: React.FC<SelectionChipProps> = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
        ${selected 
          ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:bg-primary-50'}
      `}
    >
      {selected && <Check size={16} />}
      {label}
    </button>
  );
};