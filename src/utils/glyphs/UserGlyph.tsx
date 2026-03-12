import Svg, { Path } from "react-native-svg";
import { colors } from "../../theme/colors";
import { GlyphProps } from "./types";

export function UserGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 12 A4 4 0 1 0 12 4 A4 4 0 1 0 12 12"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
      />
      <Path
        d="M4 20 C4 16 8 15 12 15 C16 15 20 16 20 20"
        stroke={color}
        strokeWidth={2.3}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};