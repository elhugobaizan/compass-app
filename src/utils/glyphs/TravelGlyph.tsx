import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function TravelGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 12 L20 12"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
      <Path
        d="M16 8 L20 12 L16 16"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
      />
    </Svg>
  );
}