import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function TaxGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M6 4 H16 L20 8 V20 H6 Z"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
      />
      <Path
        d="M8 12 H16 M8 16 H14"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}