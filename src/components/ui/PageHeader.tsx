import { View, Text } from 'react-native';
import { useHeaderStyles } from '../pages/Styles/styles';
import { Button } from 'antd';
import { useBreakpoint } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigation } from '../types';

export function PageHeader({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const header = useHeaderStyles();
  const device = useBreakpoint();
  const navigation = useNavigation<StackNavigation>();
  return (
    <View style={header.container}>
      <View style={header.left}>
        {/* Aquí podrías agregar un botón de "volver" si quieres */}
        {!device.isMobile && (<View>
          <Button type='text' onClick={() => navigation.navigate("ObjetivosStack", { screen: "Viajes" } as const)}>
            Volver
          </Button>
        </View>)}
        <View>
          <Text style={header.title}>{title}</Text>
          <Text style={header.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={header.actions}>
        {children}
      </View>
    </View>
  )
}