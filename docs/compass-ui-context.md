Proyecto: Compass

Qué es:
- App financiera personal para centralizar cuentas, movimientos, transferencias, analytics y patrimonio.
- El modelo conceptual incluye instrumentos financieros, wallets, bancos, criptos, impuestos y gastos.

Stack:
- React
- TypeScript
- Tailwind
- Arquitectura basada en componentes reutilizables + hooks de queries/mutations

Objetivo de producto:
- UI clara, moderna y compacta
- Mobile orientado a lectura rápida
- Desktop con más control y acciones
- Diseño consistente entre cuentas, movimientos, transferencias y analytics

## Convenciones de UI actuales

### Mobile
- Prioridad: escaneo rápido
- Menos acciones visibles
- Cards compactas
- Menos metadata secundaria

### Desktop
- Más espacio para acciones
- Footers o acciones contextuales integradas
- Mejor jerarquía visual sin sobrecargar

## Sistema de botones actual

`Button.tsx` soporta:

### Variants
- `primary`
- `secondary`
- `ghost`
- `danger`
- `danger-ghost`

### Sizes
- `sm`
- `md`

### Intención UX
- `primary` = acción principal
- `secondary` = acción importante no principal
- `ghost` = acción secundaria / contextual
- `danger` = confirmación destructiva
- `danger-ghost` = destructiva liviana/contextual

## ConfirmDialog
Ya fue alineado al sistema nuevo.

Soporta:
- `confirmText`
- `cancelText`
- `loadingText`
- `confirmVariant`
- `isLoading`

Uso típico:
- cancelar = `ghost`
- confirmar destructivo = `danger`

## Módulo de cuentas — estado actual

### Account types normalizados
- `BANK`
- `WALLET`
- `BROKER`

### Componentes hechos
- `AccountCard`
- `AccountCardSkeleton`
- `AccountListItem`
- `AccountsPage`

### Reglas UX definidas
- `Método de pago` se muestra como badge
- `accountGroup` no se muestra en UI
- Mobile = solo lectura rápida
- Desktop = acciones visibles
- Acciones de cuenta viven fuera de la card base

### Diseño actual de cuentas
- `AccountCard` muestra:
  - icono por tipo
  - nombre
  - institución
  - badge de moneda
  - badge opcional de método de pago
  - saldo
- `AccountListItem`:
  - mobile: solo card
  - desktop: card + footer/solapa con acciones
- acciones desktop:
  - editar = `secondary`
  - eliminar = `danger-ghost`

### AccountsPage
Ya refactorizada para usar:
- loading con skeletons
- empty state
- create/edit/delete flows
- `ConfirmDialog` para delete

## Estilo visual buscado
- Menos UI tipo “formulario”
- Más UI tipo “producto”
- Cards escaneables
- Metadata secundaria liviana
- Importes y saldos con jerarquía clara
- Acciones menos pesadas visualmente

## Próximas áreas a alinear
- `TransferRow`
- visualización de movimientos
- analytics / KPIs
- posibles menús contextuales
- consistencia entre cuentas, movimientos y assets

## Cómo quiero trabajar en este chat
- Prefiero refactors graduales, no reescrituras innecesarias
- Quiero propuestas con criterio UX + criterio técnico
- Si algo está mal estructurado, prefiero que me lo digas directo
- Si proponés código, mejor si ya viene pensado para integrarse con lo que tengo

## Qué quiero hacer ahora
[ACÁ PEGAR EL OBJETIVO DEL CHAT NUEVO]