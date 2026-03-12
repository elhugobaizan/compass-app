import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function ExpensesGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 4 H18 V20 L15 18 L12 20 L9 18 L6 20 Z"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
        strokeLinejoin="round"
      />
      <Path
        d="M9 9 H15 M9 13 H13"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
    </Svg>
  );
};