import Svg, { Path } from "react-native-svg";
import { colors } from "@/theme/colors";
import { GlyphProps } from "./types";

export function WalletGlyph({ size = 18, color = colors.neutral[500] }: GlyphProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M4 8 H20 V18 H4 Z"
        stroke={color}
        strokeWidth={2.3}
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M14 13 H18"
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
      />
    </Svg>
  );
}