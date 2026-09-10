import React from 'react';
import { FaIcon } from '../FaIcon';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface EmptyStateProps {
  icon: IconDefinition;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8E5] p-8 sm:p-10 text-center space-y-4 shadow-[0_2px_12px_rgba(6,35,75,0.03)] ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#06234B]/5 text-[#06234B] flex items-center justify-center mx-auto border border-[#E2E8E5]/80">
        <FaIcon icon={icon} className="text-xl text-[#68A91B]" />
      </div>

      <div className="space-y-1.5 max-w-md mx-auto">
        <h3 className="font-serif text-lg font-bold text-[#06234B]">{title}</h3>
        <p className="text-xs sm:text-sm text-[#5C6B78] leading-relaxed">
          {description}
        </p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#06234B] hover:bg-[#0B3168] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white border border-[#E2E8E5] hover:bg-[#F7F8F3] text-[#06234B] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
