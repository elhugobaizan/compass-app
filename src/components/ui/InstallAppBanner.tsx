import { Platform, Pressable, Text, View } from "react-native";

import { palette } from "../../AppStyles";
import { useInstallPrompt } from "../utils";

const BANNER_HEIGHT = 52;

/** Solo monta el hook para capturar beforeinstallprompt; no muestra UI. Usar durante la splash. */
export function InstallPromptCapture() {
  useInstallPrompt();
  return null;
}

export function InstallAppBanner() {
  const { showBanner, prompt, isIOS, dismiss } = useInstallPrompt();

  if (Platform.OS !== "web" || !showBanner) return null;

  const handleInstall = () => {
    if (prompt) prompt();
    else dismiss();
  };

  return (
    <View style={bannerStyles.wrap}>
      <View style={bannerStyles.bar}>
        <View style={bannerStyles.content}>
          <Text style={bannerStyles.title} numberOfLines={1}>
            {prompt ? "Instalar como app" : "Añadir a pantalla de inicio"}
          </Text>
          {isIOS && !prompt && (
            <Text style={bannerStyles.hint} numberOfLines={1}>
              Compartir → "Añadir a la pantalla de inicio"
            </Text>
          )}
        </View>
        <View style={bannerStyles.actions}>
          <Pressable onPress={handleInstall} style={bannerStyles.btnPrimary}>
            <Text style={bannerStyles.btnPrimaryText}>{prompt ? "Instalar" : "Ver cómo"}</Text>
          </Pressable>
          <Pressable onPress={dismiss} style={bannerStyles.btnSecondary}>
            <Text style={bannerStyles.btnSecondaryText}>Ahora no</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const bannerStyles = {
  wrap: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: (window.innerWidth < 576 ? 64 : 0),
    paddingHorizontal: 12,
    paddingVertical: 8,
    zIndex: 1000,
  },
  bar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    backgroundColor: palette.surfaceDark,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: BANNER_HEIGHT,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }
      : { elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 12 }),
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: palette.textOnDark,
  },
  hint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: palette.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnPrimaryText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: palette.textOnDark,
  },
  btnSecondary: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  btnSecondaryText: {
    fontSize: 13,
    fontWeight: "500" as const,
    color: "rgba(255,255,255,0.9)",
  },
};
