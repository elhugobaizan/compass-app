import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function BankGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 10 L12 4 L20 10"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M6 10 V18 M10 10 V18 M14 10 V18 M18 10 V18"
        stroke={color}
        strokeWidth={2.3}
      />
    </Svg>
  );
}