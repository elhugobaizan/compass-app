import { JSX } from "react";

type FilterChipOption<T extends string> = {
  readonly label: string;
  readonly value: T;
};

type FilterChipsProps<T extends string> = {
  readonly value: T;
  readonly onChange: (value: T) => void;
  readonly options: readonly FilterChipOption<T>[];
};

export default function FilterChips<T extends string>({
  value,
  onChange,
  options,
}: FilterChipsProps<T>): JSX.Element {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              isActive
                ? "rounded-full border border-[var(--color-accent)] bg-[var(--color-accent-bg)] px-2.5 py-1 text-sm font-medium text-[var(--color-accent-text)] transition"
                : "rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1 text-sm font-medium text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-bg)]"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}