'use client';

import { useCallback, useRef } from 'react';

type OtpCodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

const LENGTH = 6;

export default function OtpCodeInput({
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpCodeInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(LENGTH, ' ').slice(0, LENGTH).split('');

  const focusIndex = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const updateValue = useCallback(
    (next: string) => {
      onChange(next.replace(/\D/g, '').slice(0, LENGTH));
    },
    [onChange],
  );

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const chars = digits.map((d) => (d === ' ' ? '' : d));
    chars[index] = digit;
    const next = chars.join('').slice(0, LENGTH);
    updateValue(next);
    if (digit && index < LENGTH - 1) focusIndex(index + 1);
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index].trim() && index > 0) {
      focusIndex(index - 1);
    }
    if (key === 'ArrowLeft' && index > 0) focusIndex(index - 1);
    if (key === 'ArrowRight' && index < LENGTH - 1) focusIndex(index + 1);
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    updateValue(pasted);
    focusIndex(Math.min(pasted.length, LENGTH - 1));
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => {
        const isActive = index === value.length && value.length < LENGTH;
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit.trim()}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event.key)}
            onPaste={handlePaste}
            onFocus={() => focusIndex(index)}
            className={[
              'h-12 w-10 sm:h-14 sm:w-12 rounded-lg border bg-white text-center text-lg font-semibold text-gray-900 outline-none transition-colors',
              error
                ? 'border-red-400 focus:border-red-500'
                : isActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
            ].join(' ')}
          />
        );
      })}
    </div>
  );
}
