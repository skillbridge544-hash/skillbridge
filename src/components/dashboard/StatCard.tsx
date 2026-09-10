import React from 'react';
import { FaIcon } from '../FaIcon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: IconDefinition;
  variant?: 'default' | 'highlight' | 'navy';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sublabel,
  icon,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-[#F4F9EE] border-[#D6ECC0] text-[#1A2233]';
      case 'navy':
        return 'bg-[#06234B] text-white border-[#0B3168]';
      default:
        return 'bg-white border-[#E2E8E5] text-[#1A2233]';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-[#68A91B]/15 text-[#4F8214]';
      case 'navy':
        return 'bg-white/10 text-[#68A91B]';
      default:
        return 'bg-[#06234B]/5 text-[#06234B]';
    }
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all shadow-[0_2px_8px_rgba(6,35,75,0.04)] ${getVariantStyles()} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${
              variant === 'navy' ? 'text-[#9FB0C8]' : 'text-[#5C6B78]'
            }`}
          >
            {label}
          </p>
          <p
            className={`text-2xl sm:text-3xl font-bold font-serif ${
              variant === 'navy' ? 'text-white' : 'text-[#06234B]'
            }`}
          >
            {value}
          </p>
          {sublabel && (
            <p
              className={`text-xs ${
                variant === 'navy' ? 'text-[#C9D6E8]' : 'text-[#5C6B78]'
              }`}
            >
              {sublabel}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconStyles()}`}
          >
            <FaIcon icon={icon} className="text-base" />
          </div>
        )}
      </div>
    </div>
  );
};
