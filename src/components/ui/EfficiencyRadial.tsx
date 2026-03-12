import { View, Text, StyleSheet } from "react-native"
import Svg, { Path } from "react-native-svg"
import { theme } from "../theme"

const DEFAULT_THRESHOLDS = [75, 90] as const
const DEFAULT_COLORS = {
  low: theme.colors.status.negative,
  mid: theme.colors.status.warning,
  high: theme.colors.status.positive,
} as const
const DEFAULT_TRACK_COLOR = theme.colors.neutral[200]

export type EfficiencyRadialColors = {
  low?: string
  mid?: string
  high?: string
  track?: string
}

type Props = {
  value: number
  size?: number
  title?: string
  /** Umbrales [bajo→medio, medio→alto] en %. Por defecto [75, 90]: menor a 75 low, 75-90 mid, 90+ high */
  thresholds?: [number, number]
  /** Colores por rango (low, mid, high) y track (fondo). Por defecto usa theme status */
  colors?: EfficiencyRadialColors
}

export const EfficiencyRadial = ({
  value,
  title = "",
  size = 110,
  thresholds = DEFAULT_THRESHOLDS as [number, number],
  colors: colorsProp,
}: Props) => {
  const strokeWidth = 10
  const radius = size / 2 - strokeWidth
  const cx = size / 2
  const cy = size / 2

  const [tLow, tHigh] = thresholds
  const colors = {
    low: colorsProp?.low ?? DEFAULT_COLORS.low,
    mid: colorsProp?.mid ?? DEFAULT_COLORS.mid,
    high: colorsProp?.high ?? DEFAULT_COLORS.high,
    track: colorsProp?.track ?? DEFAULT_TRACK_COLOR,
  }

  const clamp = Math.max(0, Math.min(value, 100))

  const START_ANGLE = -225
  const TOTAL_ANGLE = 270

  const toAngle = (percent: number) =>
    START_ANGLE + (percent / 100) * TOTAL_ANGLE

  const polar = (angle: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  const arc = (endPercent: number) => {
    const start = polar(START_ANGLE)
    const end = polar(toAngle(endPercent))
    const largeArcFlag = endPercent > 50 ? 1 : 0

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}
    `
  }

  const getColor = () => {
    if (clamp >= tHigh) return colors.high
    if (clamp >= tLow) return colors.mid
    return colors.low
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Base track */}
        <Path
          d={arc(100)}
          stroke={colors.track}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />

        {/* Indicador */}
        <Path
          d={arc(clamp)}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.label}>
        <Text style={styles.value}>{isNaN(clamp) ? "--" : `${clamp.toFixed(1)}%`}</Text>
        <Text style={styles.caption}> {title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    top: "32%",
    alignSelf: "center",
    alignItems: "center",
  },
  value: {
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.weight.bold,
  },
  caption: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[500],
  },
})