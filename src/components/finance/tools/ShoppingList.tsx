import { JSX, useMemo, useState } from "react";
import { Check, Pin, Plus, Trash2 } from "lucide-react";

import SectionBlock from "@/components/ui/SectionBlock";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { useShoppingItemsQuery } from "@/hooks/queries/useShoppingItemsQuery";
import {
  useCreateShoppingItem,
  useUpdateShoppingItem,
  useDeleteShoppingItem,
} from "@/hooks/mutations/useShoppingItemMutations";
import type { ShoppingItem } from "@/types/shoppingItem";

type ShoppingListProps = {
  readonly isMobile: boolean;
};

export default function ShoppingList({ isMobile }: ShoppingListProps): JSX.Element {
  const [newItem, setNewItem] = useState("");

  const { data: items = [], isLoading, isError } = useShoppingItemsQuery();
  const { mutateAsync: createItem, isPending: isCreating } = useCreateShoppingItem();
  const { mutateAsync: updateItem } = useUpdateShoppingItem();
  const { mutateAsync: deleteItem } = useDeleteShoppingItem();

  // Pendientes primero; los comprados van al final
  const { pending, done, recurringCount } = useMemo(() => {
    return {
      pending: items.filter((item) => !item.is_done),
      done: items.filter((item) => item.is_done),
      recurringCount: items.filter((item) => item.is_recurring).length,
    };
  }, [items]);

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newItem.trim();
    if (!name) return;

    await createItem({ name });
    setNewItem("");
  }

  async function handleToggle(item: ShoppingItem) {
    await updateItem({ id: item.id, data: { is_done: !item.is_done } });
  }

  async function handleToggleRecurring(item: ShoppingItem) {
    await updateItem({
      id: item.id,
      data: { is_recurring: !item.is_recurring },
    });
  }

  /**
   * Cierra la compra: los productos habituales vuelven a pendiente para la
   * próxima, y los ocasionales ya comprados se eliminan.
   */
  async function handleFinishShopping() {
    await Promise.all(
      done.map((item) =>
        item.is_recurring
          ? updateItem({ id: item.id, data: { is_done: false } })
          : deleteItem(item.id),
      ),
    );
  }

  return (
    <SectionBlock
      title="Lista de compras"
      subtitle={
        isMobile
          ? undefined
          : "Marcá con el pin los productos habituales: vuelven solos tras cada compra"
      }
      action={
        done.length > 0 && !isMobile ? (
          <Button variant="secondary" onClick={handleFinishShopping}>
            Terminé la compra ({done.length})
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Agregar producto..."
            className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] px-3 py-2"
          />
          <Button type="submit" disabled={!newItem.trim() || isCreating}>
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {isLoading && (
          <p className="text-sm text-[var(--color-muted)]">Cargando lista...</p>
        )}

        {isError && (
          <EmptyState
            title="No pudimos cargar la lista"
            description="Revisá la conexión o el backend e intentá de nuevo."
            variant="error"
          />
        )}

        {!isLoading && !isError && items.length === 0 && (
          <EmptyState
            title="La lista está vacía"
            description="Agregá lo que necesites comprar y lo vas tachando en el súper."
          />
        )}

        {!isLoading && !isError && items.length > 0 && (
          <>
            <ul className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)]">
              {[...pending, ...done].map((item) => (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    aria-label={item.is_done ? "Marcar como pendiente" : "Marcar como comprado"}
                    className={
                      item.is_done
                        ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-contrast)]"
                        : "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]"
                    }
                  >
                    {item.is_done && <Check className="h-3.5 w-3.5" />}
                  </button>

                  <span
                    className={
                      item.is_done
                        ? "min-w-0 flex-1 truncate text-sm text-[var(--color-muted)] line-through"
                        : "min-w-0 flex-1 truncate text-sm text-[var(--color-ink)]"
                    }
                  >
                    {item.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleRecurring(item)}
                    aria-label={
                      item.is_recurring
                        ? `Quitar ${item.name} de habituales`
                        : `Marcar ${item.name} como habitual`
                    }
                    title={
                      item.is_recurring
                        ? "Habitual: vuelve a la lista tras cada compra"
                        : "Marcar como habitual"
                    }
                    className={
                      item.is_recurring
                        ? "shrink-0 rounded-md p-1.5 text-[var(--color-accent-text)]"
                        : "shrink-0 rounded-md p-1.5 text-[var(--color-border)] transition-colors hover:text-[var(--color-muted)]"
                    }
                  >
                    <Pin className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    aria-label={`Eliminar ${item.name}`}
                    className="shrink-0 rounded-md p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-expense-bg)] hover:text-[var(--color-expense-text)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[var(--color-muted)]">
                {pending.length} pendiente{pending.length === 1 ? "" : "s"}
                {done.length > 0 && ` · ${done.length} comprado${done.length === 1 ? "" : "s"}`}
                {recurringCount > 0 && ` · ${recurringCount} habitual${recurringCount === 1 ? "" : "es"}`}
              </p>

              {done.length > 0 && isMobile && (
                <Button variant="secondary" size="sm" onClick={handleFinishShopping}>
                  Terminé la compra
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </SectionBlock>
  );
}
