import FilterChips from "@/components/ui/FilterChips";
import { ACCOUNT_TYPE_FILTERS, AccountTypeFilterValue } from "@/types/account";
import { JSX } from "react";

type AccountTypeFilterProps = {
  readonly value: AccountTypeFilterValue;
  readonly onChange: (value: AccountTypeFilterValue) => void;
};

export default function AccountTypeFilter({
  value,
  onChange,
}: AccountTypeFilterProps): JSX.Element {
  return (
    <FilterChips
      value={value}
      onChange={onChange}
      options={ACCOUNT_TYPE_FILTERS}
    />
  );
}