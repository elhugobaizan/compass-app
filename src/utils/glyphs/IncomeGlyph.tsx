import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function IncomeGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 12 H8"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
      <Path
        d="M12 8 L8 12 L12 16"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}