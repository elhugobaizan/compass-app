import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function HomeGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      
      <Path
        d="M3 10 L12 4 L21 10"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <Path
        d="M5 10 V20 H19 V10"
        stroke={color}
        strokeWidth={2.3}
        strokeLinejoin="round"
        fill="none"
      />

    </Svg>
  );
}