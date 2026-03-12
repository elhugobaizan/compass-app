import React from 'react';
import Svg, { Circle, Polygon } from 'react-native-svg';

export const COMPASS_SIZE_DEFAULT = 256;

export type CompassSvgProps = Readonly<{
  size?: number;
  /** Si false, no se dibuja el círculo de fondo (útil en LoadingModal sobre fondo transparente). */
  withCircle?: boolean;
}>;

export function CompassSvg({ size = COMPASS_SIZE_DEFAULT, withCircle = true }: CompassSvgProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1024 1024">
      {withCircle && <Circle cx="512" cy="512" r="470" fill="#0F172A" />}
      <Polygon
        points="512,190 640,512 512,430 384,512"
        fill="#0E7490"
        transform="rotate(35 512 512)"
      />
      <Polygon
        points="512,830 580,512 512,585 444,512"
        fill="#FFFFFF"
        transform="rotate(35 512 512)"
      />
    </Svg>
  );
}
