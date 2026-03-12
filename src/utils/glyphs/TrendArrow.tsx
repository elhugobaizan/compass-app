import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function TrendArrow({ size = 14, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 16 L16 4 M10 4 H16 V10"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}