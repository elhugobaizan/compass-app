import { useBreakpoint } from "@/utils/utils";
import type { VencimientosHoy } from "@/utils/utils";
import MobileLayout from "./MobileLayout";
import WebLayout from "./WebLayout";

/** Nombre de la tab actual (para sincronizar Sider en web). */
export type CurrentTabRoute = Readonly<{ name: string }>;

export type AppLayoutProps = Readonly<{
  vencimientosHoy: VencimientosHoy;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
  viewAlerts: () => void;
  viewUser: () => void;
  /** Ruta/tab actual; se usa en WebLayout para selectedKeys del Menu. */
  route?: CurrentTabRoute;
  children: React.ReactNode;
}>;

export default function AppLayout({
  vencimientosHoy,
  isVisible,
  setIsVisible,
  viewAlerts,
  viewUser,
  route,
  children,
}: AppLayoutProps) {
  const { isMobile } = useBreakpoint();

  const containerStyle = { flex: 1, position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 };

  if (isMobile) {
    return (
      <div style={containerStyle}>
        <MobileLayout
          vencimientosHoy={vencimientosHoy}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          viewAlerts={viewAlerts}
          viewUser={viewUser}
        >
          {children}
        </MobileLayout>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <WebLayout
        vencimientosHoy={vencimientosHoy}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        viewAlerts={viewAlerts}
        currentTabName={route?.name}
      >
        {children}
      </WebLayout>
    </div>
  );
}
