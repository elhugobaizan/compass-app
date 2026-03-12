import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function ExpenseGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 12 H16"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
      <Path
        d="M12 8 L16 12 L12 16"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}