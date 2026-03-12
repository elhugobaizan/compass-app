// Este es el styles general para todas las pages
// Dentro de cada folder deberia haber un styles.ts que herede de este
// e incluya cosas propias de cada uno
import { useMemo } from "react";
import { createStyles } from "../../theme/createStyles";
import { useTheme } from "../../theme/ThemeProvider";
import { basePageStylesConfig } from "./PageStyles";
import { baseListStylesConfig } from "./ListStyles";
import { BaseStylesProps } from "../../types";
import { baseInfoStylesConfig } from "./InfoStyles";
import { baseHeroStylesConfig } from "./HeroStyles";
import { baseCardStylesConfig } from "./CardStyles";
import { baseFormStylesConfig } from "./FormStyles";
import { baseTableStylesConfig } from "./TableStyles";
import { baseHeaderStylesConfig } from "./HeaderStyles";
import { baseModalStylesConfig } from "./ModalStyles";
import { basePanelStylesConfig } from "./PanelStyles";

// Hooks que usan la configuración base
// Aceptan props para variar según isMobile
export const usePageStyles = createStyles((theme) => basePageStylesConfig(theme));
export const useListStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => baseListStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
};
export const useInfoStyles = createStyles((theme) => baseInfoStylesConfig(theme));
export const useHeroStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => baseHeroStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
};
export const useCardStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => baseCardStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
};
export const useFormStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => baseFormStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
};
export const useTableStyles = createStyles((theme) => baseTableStylesConfig(theme));
export const useHeaderStyles = (props?: BaseStylesProps)  => {
  const { theme } = useTheme();
  return useMemo(
    () => baseHeaderStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
}
export const useModalStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => baseModalStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
}
export const usePanelStyles = (props?: BaseStylesProps) => {
  const { theme } = useTheme();
  return useMemo(
    () => basePanelStylesConfig(theme, props),
    [theme, props?.isMobile]
  );
}