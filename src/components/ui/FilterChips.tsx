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
                ? "rounded-full border border-gray-300 bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-900 transition"
                : "rounded-full border border-gray-200 bg-white px-2.5 py-1 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
            }
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}