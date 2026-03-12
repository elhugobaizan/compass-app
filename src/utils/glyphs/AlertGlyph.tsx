import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";


export function AlertGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 17 H18 L16 14 V10 A4 4 0 0 0 8 10 L6 14 Z"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
        strokeLinejoin="round"
      />
      <Path
        d="M10 19 A2 2 0 0 0 14 19"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}