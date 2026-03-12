import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';

import { CompassSvg, COMPASS_SIZE_DEFAULT } from './CompassSvg';

const ROTATION_LOOP_DURATION_MS = 2000;
const APP_NAME = 'Compass';

export type AnimatedCompassProps = {
  onFinish?: () => void;
  /** Si true, el fondo es transparente (LoadingModal). Si false, splash con nombre de app. */
  transparentBackground?: boolean;
  /** Tamaño del ícono en px. Por defecto 256; en LoadingModal se usa más chico. */
  size?: number;
  /** Si true, sigue girando en loop (LoadingModal). */
  loop?: boolean;
  /** Si false, no se dibuja el círculo de fondo del compás (LoadingModal sobre transparente). */
  withCircle?: boolean;
};

export default function AnimatedCompass({
  onFinish,
  transparentBackground,
  size = COMPASS_SIZE_DEFAULT,
  loop = false,
  withCircle = true,
}: Readonly<AnimatedCompassProps>) {
  const rotation = useSharedValue(-120);
  const isSplash = !transparentBackground;

  useEffect(() => {
    if (loop) {
      rotation.value = withSequence(
        withTiming(15, { duration: 400 }),
        withSpring(35, { damping: 12, stiffness: 130 }),
        withRepeat(
          withSequence(
            withTiming(35, { duration: 0 }),
            withTiming(35 + 360, { duration: ROTATION_LOOP_DURATION_MS })
          ),
          -1,
          false
        )
      );
    } else {
      rotation.value = withSequence(
        withTiming(15, { duration: 500 }),
        withSpring(35, {
          damping: 12,
          stiffness: 130,
        }, (finished) => {
          if (finished && onFinish) {
            setTimeout(() => {
              runOnJS(onFinish)();
            }, 120);
          }
        })
      );
    }
  }, [onFinish, loop]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: transparentBackground ? 'transparent' : '#0F172A',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={[animatedStyle, isSplash && { marginBottom: 8 }]}>
        <CompassSvg size={size} withCircle={withCircle} />
      </Animated.View>
      {isSplash && (
        <Text
          style={{
            fontSize: 26,
            fontWeight: '500',
            color: 'rgba(255, 255, 255, 0.98)',
            letterSpacing: 4,
            marginTop: 20,
            textTransform: 'uppercase',
          }}
          numberOfLines={1}
        >
          {APP_NAME}
        </Text>
      )}
    </View>
  );
}
