import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/categories";
import type { Category } from "@/types/category";

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}