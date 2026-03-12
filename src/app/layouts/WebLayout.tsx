import { BankGlyph } from '@/utils/glyphs/BankGlyph';
import { ExpensesGlyph } from '@/utils/glyphs/ExpensesGlyph';
import { HomeGlyph } from '@/utils/glyphs/HomeGlyph';
import { TaxGlyph } from '@/utils/glyphs/TaxGlyph';
import { WalletGlyph } from '@/utils/glyphs/WalletGlyph';
//import VencimientosModal from '../components/VencimientosModal';
import { theme } from '@/theme';
import type { VencimientosHoy } from '@/utils/utils';
import Sider from 'antd/es/layout/Sider';
import { Menu } from 'antd';

type Props = Readonly<{
  vencimientosHoy: VencimientosHoy;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
  viewAlerts: () => void;
  /** Nombre de la tab activa; sincroniza el ítem seleccionado del Sider. */
  currentTabName?: string;
  children: React.ReactNode;
}>;

const SIDER_MENU_KEYS = ['HomeStack', 'BancosStack', 'WalletsStack', 'ImpuestosStack', 'MovimientosStack', 'ObjetivosStack'] as const;

export default function WebLayout({
  vencimientosHoy,
  isVisible,
  setIsVisible,
  currentTabName,
  children,
}: Props) {
  const selectedKeys = currentTabName && SIDER_MENU_KEYS.includes(currentTabName as typeof SIDER_MENU_KEYS[number])
    ? [currentTabName]
    : [];

  const menuTheme = {
    components: {
      Menu: {
        darkItemColor: `${theme.colors.text.inverse}80`,
        darkItemSelectedBg: theme.colors.primary.link,
        darkItemSelectedColor: theme.colors.text.inverse,
        itemMarginInline: 0,
        itemPaddingInline: 10,
        iconMarginInlineEnd: 14,
        iconMarginInlineStart: 14,

      },
    },
  };

  return (
    <div style={{ flex: 1, flexDirection: 'row', minHeight: '100%', backgroundColor: theme.colors.background.app }}>
      <style>{`
        .web-layout-sider.ant-layout-sider { background: ${theme.colors.background.sidebar} !important; }
        .web-layout-sider .ant-menu-dark { background: ${theme.colors.background.sidebar} !important; }
        .web-layout-sider .ant-menu-item-selected { background: rgba(14, 116, 144, 0.2) !important; }
        .web-layout-sider .ant-menu-item-icon { margin-inline-end: 14px; }
      `}</style>
      <Sider className="web-layout-sider" style={{ background: theme.colors.background.sidebar }}>
        <div style={{ height: 32, margin: 16, color: 'white' }}>
          Finanzas
        </div>
        <Menu
          theme="dark"
          mode="inline"
          style={{ marginInlineEnd: 14 }}
          selectedKeys={selectedKeys}
          onClick={({ key }) => {
            if (key === 'Objetivos') {
              navigation.navigate('ObjetivosStack', { screen: 'Objetivos' });
            } else if (key === 'BancosStack') {
              navigation.navigate('BancosStack', { screen: 'Bancos' });
            } else if (key === 'WalletsStack') {
              navigation.navigate('WalletsStack', { screen: 'Wallets' });
            } else if (key === 'ImpuestosStack') {
              navigation.navigate('ImpuestosStack', { screen: 'Impuestos' });
            } else if (key === 'MovimientosStack') {
              navigation.navigate('MovimientosStack', { screen: 'Movimientos' });
            } else if (key === 'Viajes') {
              navigation.navigate('ObjetivosStack', { screen: 'Viajes' });
            } else {
              navigation.navigate(key as never);
            }
          }}
          items={[
            { key: 'HomeStack', icon: <span style={{ marginInlineEnd: 2, marginInlineStart: 0 }}><HomeGlyph size={24} color={theme.colors.text.inverse} /></span>, label: 'Inicio' },
            { key: 'BancosStack', icon: <span style={{ marginInlineEnd: 2, marginInlineStart: 0 }}><BankGlyph size={24} color={theme.colors.text.inverse} /></span>, label: 'Bancos' },
            { key: 'WalletsStack', icon: <span style={{ marginInlineEnd: 2, marginInlineStart: 0 }}><WalletGlyph size={24} color={theme.colors.text.inverse} /></span>, label: 'Wallets' },
            { key: 'ImpuestosStack', icon: <span style={{ marginInlineEnd: 2, marginInlineStart: 0 }}><TaxGlyph size={24} color={theme.colors.text.inverse} /></span>, label: 'Impuestos' },
            { key: 'MovimientosStack', icon: <span style={{ marginInlineEnd: 2, marginInlineStart: 0 }}><ExpensesGlyph size={24} color={theme.colors.text.inverse} /></span>, label: 'Movimientos' },
            /* { key: 'Objetivos', icon: <FontAwesome5 name="bullseye" size={16} color="white" style={{ marginInlineEnd: 14 }} />, label: 'Objetivos',
              children: [
                { key: 'Viajes', icon: <FontAwesome5 name="plane" size={16} color="white" style={{ marginInlineEnd: 14 }} />, label: 'Viajes' }
              ]
            } */
          ]}
        >

        </Menu>
      </Sider>
      <div style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignContent: 'center', minHeight: '100%' }}>
        <div style={{ flex: 1, alignSelf: 'center', width: '100%', maxWidth: 1100 }}>
          {children}
        </div>
      </div>
      {/*       <VencimientosModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        vencimientosHoy={vencimientosHoy}
      />
 */}    </div>
  );
}
