import { JSX, useRef, useState } from "react";
import { Calculator, Delete } from "lucide-react";

import { evaluateExpression, isExpression } from "@/utils/calculator";
import { formatCurrency } from "@/utils/formatters";

type AmountFieldProps = {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly label?: string;
  readonly name?: string;
  readonly placeholder?: string;
  readonly autoFocus?: boolean;
  readonly currency?: string;
};

const KEYS = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

/**
 * Campo de monto que acepta operaciones simples (ej. "1200+800-500").
 * Incluye un mini-teclado para poder usar + y - en mobile, donde el teclado
 * numérico del sistema no los trae.
 */
export default function AmountField({
  value,
  onChange,
  label = "Monto",
  name = "amount",
  placeholder = "0",
  autoFocus = false,
  currency,
}: AmountFieldProps): JSX.Element {
  const [showKeypad, setShowKeypad] = useState(false);

  const result = evaluateExpression(value);
  const showResult = isExpression(value) && result !== null;
  const hasError = value.trim() !== "" && result === null;

  // El ref se actualiza al instante: si tocás varias teclas seguidas, cada una
  // parte del valor real y no del que había en el último render.
  const valueRef = useRef(value);
  valueRef.current = value;

  function setValue(next: string) {
    valueRef.current = next;
    onChange(next);
  }

  function append(key: string) {
    setValue(valueRef.current + key);
  }

  function backspace() {
    setValue(valueRef.current.slice(0, -1));
  }

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor={name} className="block text-sm font-medium text-[var(--color-ink)]">
          {label}
        </label>

        <button
          type="button"
          onClick={() => setShowKeypad((prev) => !prev)}
          aria-label="Calculadora"
          aria-pressed={showKeypad}
          className={
            showKeypad
              ? "inline-flex items-center gap-1 rounded-lg border border-[var(--color-accent)] bg-[var(--color-accent-bg)] px-2 py-1 text-xs font-medium text-[var(--color-accent-text)]"
              : "inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-accent-bg)]"
          }
        >
          <Calculator className="h-3.5 w-3.5" />
          Calculadora
        </button>
      </div>

      <input
        type="text"
        name={name}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-lg"
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
      />

      {showResult && (
        <p className="mt-1 text-sm font-medium text-[var(--color-accent-text)]">
          = {formatCurrency(result, currency)}
        </p>
      )}

      {hasError && (
        <p className="mt-1 text-xs text-[var(--color-expense-text)]">
          Revisá la operación: solo se pueden sumar y restar números.
        </p>
      )}

      {showKeypad && (
        <div className="mt-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-2">
          <div className="grid grid-cols-4 gap-1.5">
            {KEYS.map((key) => (
              <KeypadButton key={key} onClick={() => append(key)}>
                {key}
              </KeypadButton>
            ))}

            <KeypadButton onClick={backspace} aria-label="Borrar">
              <Delete className="mx-auto h-4 w-4" />
            </KeypadButton>

            <KeypadButton onClick={() => append("+")} tone="accent">
              +
            </KeypadButton>
            <KeypadButton onClick={() => append("-")} tone="accent">
              −
            </KeypadButton>
            <KeypadButton onClick={() => setValue("")} tone="muted">
              C
            </KeypadButton>

            {/* Resuelve la operación y deja el resultado en el campo */}
            <KeypadButton
              onClick={() => result !== null && setValue(String(result))}
              tone="accent"
              disabled={result === null}
            >
              =
            </KeypadButton>
          </div>
        </div>
      )}
    </div>
  );
}

type KeypadButtonProps = {
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly tone?: "default" | "accent" | "muted";
  readonly disabled?: boolean;
  readonly "aria-label"?: string;
};

function KeypadButton({
  children,
  onClick,
  tone = "default",
  disabled = false,
  ...rest
}: KeypadButtonProps): JSX.Element {
  const toneClass =
    tone === "accent"
      ? "bg-[var(--color-accent-bg)] text-[var(--color-accent-text)]"
      : tone === "muted"
        ? "bg-[var(--color-card)] text-[var(--color-muted)]"
        : "bg-[var(--color-card)] text-[var(--color-ink)]";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border border-[var(--color-border)] py-2.5 text-base font-medium transition-colors hover:bg-[var(--color-accent-bg)] disabled:opacity-40 ${toneClass}`}
      {...rest}
    >
      {children}
    </button>
  );
}
