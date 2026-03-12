import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import Alerts from '../components/Alerts';
import AppHeaderLeft from '../components/AppHeaderLeft';
import { CompassIcon } from '../components/Glyphs/icons';
import BankStack from '../pages/Bancos/Stack';
import TaxStack from '../pages/Impuestos/Stack';
import MovimientoStack from '../pages/Movimientos/Stack';
import ObjetivosStack from '../pages/Objetivos/Stack';
import Viajes from '../pages/Objetivos/Viajes/pages/Viajes';
import HomeStack from '../pages/Stack';
import WalletStack from '../pages/Wallets/Stack';
import { theme } from '../theme';
import { useBreakpoint } from '../utils';
import AppLayout, { type AppLayoutProps } from './AppLayout';

const Tab = createBottomTabNavigator();

const TAB_ICON_SIZE = 22;
const tabIconSize = (size?: number) => size ?? TAB_ICON_SIZE;

const BankIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="bank" color={color} size={tabIconSize(size)} />
);
const WalletIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="wallet" color={color} size={tabIconSize(size)} />
);
const HomeIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="home" color={color} size={tabIconSize(size)} />
);
const TaxIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="tax" color={color} size={tabIconSize(size)} />
);
const ExpenseIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="expenses" color={color} size={tabIconSize(size)} />
);
const ObjetivosIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="goal" color={color} size={tabIconSize(size)} />
);
const ViajesIcon = ({ color, size }: { color: string; size?: number }) => (
  <CompassIcon name="travel" color={color} size={tabIconSize(size)} />
);

export type MainTabsProps = Readonly<
  Omit<AppLayoutProps, 'navigation' | 'children'>
>;

export default function MainTabs(props: MainTabsProps) {
  const { isMobile } = useBreakpoint();

  const screenOptions: BottomTabNavigationOptions = useMemo(() => {
    const isWeb = Platform.OS === 'web';
    const tabBarStyle = isMobile
      ? {
        backgroundColor: theme.colors.background.header,
        height: 64,
        borderTopWidth: 0,
        elevation: 8,
        ...(isWeb
          ? { boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' }
          : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }),
      }
      : { display: 'none' as const };

    const headerStyle = isMobile
      ? {
        backgroundColor: theme.colors.background.header,
        height: 56,
        borderBottomWidth: 0,
        elevation: 4,
        ...(isWeb
          ? { boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }
          : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
          }),
      }
      : {
        backgroundColor: theme.colors.background.header,
        height: 56,
        borderBottomWidth: 0,
        elevation: 4,
        boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      };

    const headerLeft = () => <AppHeaderLeft onPress={props.viewUser} />;
    const headerRight = () => (
      <Alerts alertCount={props.vencimientosHoy.total} onPress={props.viewAlerts} />
    );

    return {
      tabBarActiveTintColor: theme.colors.text.inverse,
      tabBarInactiveTintColor: 'rgba(248, 250, 252, 0.6)',
      tabBarShowLabel: true,
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      tabBarItemStyle: { paddingVertical: 6 },
      headerTitleStyle: {
        color: theme.colors.text.inverse,
        fontSize: 17,
        fontWeight: '600',
      },
      title: 'Compass',
      headerTitleAlign: 'center',
      headerLeftContainerStyle: { paddingLeft: 8 },
      headerRightContainerStyle: { paddingRight: 8 },
      tabBarStyle,
      headerStyle,
      headerLeft,
      headerRight,
    };
  }, [isMobile, props.viewUser, props.viewAlerts, props.vencimientosHoy.total]);

  return (
    <Tab.Navigator initialRouteName="HomeStack" screenOptions={screenOptions}>
      <Tab.Screen name="BancosStack" options={{ tabBarLabel: 'Bancos', tabBarIcon: BankIcon }}>
        {(screenProps) => (
          <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
            <BankStack />
          </AppLayout>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="WalletsStack"
        options={{ tabBarLabel: 'Wallets', tabBarIcon: WalletIcon }}
      >
        {(screenProps) => (
          <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
            <WalletStack />
          </AppLayout>
        )}
      </Tab.Screen>
      <Tab.Screen
        name="HomeStack"
        options={{ tabBarLabel: 'Inicio', tabBarIcon: HomeIcon }}
      >
        {(screenProps) => (
          <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
            <HomeStack />
          </AppLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="ImpuestosStack"
        options={{ tabBarLabel: 'Impuestos', tabBarIcon: TaxIcon }}>
        {(screenProps) => (
          <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
            <TaxStack />
          </AppLayout>
        )}
      </Tab.Screen>
      <Tab.Screen name="MovimientosStack" options={{ tabBarLabel: 'Movimientos', tabBarIcon: ExpenseIcon }}>
        {(screenProps) => (
          <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
            <MovimientoStack />
          </AppLayout>
        )}
      </Tab.Screen>
      {!isMobile && (
        <>
          <Tab.Screen name="ObjetivosStack" options={{ tabBarLabel: 'Objetivos', tabBarIcon: ObjetivosIcon }}>
            {(screenProps) => (
              <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
                <ObjetivosStack />
              </AppLayout>
            )}
          </Tab.Screen>
          <Tab.Screen name="Viajes" options={{ tabBarLabel: 'Viajes', tabBarIcon: ViajesIcon }}>
            {(screenProps) => (
              <AppLayout {...props} navigation={screenProps.navigation} route={{ name: screenProps.route.name }}>
                <Viajes />
              </AppLayout>
            )}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
}
