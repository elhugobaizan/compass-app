// theme/index.ts

import { colors } from './colors'
import { spacing } from './spacing'
import { typography } from './typography'
import { shadows } from './shadows'
import { radius } from './radius'

export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  radius,
}

export type Theme = typeof theme