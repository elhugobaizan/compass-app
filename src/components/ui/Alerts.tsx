import { Avatar, Badge } from "antd";
import { Pressable } from "react-native";
import { headerIconSize } from "../../AppStyles";
import { colors } from '../theme/colors';
import { CompassIcon } from './Glyphs/icons';

type AlertsProps = Readonly<{
  alertCount: number;
  onPress: () => void;
}>;

export default function Alerts({ alertCount, onPress }: AlertsProps) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={{ paddingVertical: 8, paddingHorizontal: 4 }}>
      <Badge count={alertCount} size="small">
        <Avatar
          shape="circle"
          src={<CompassIcon name="alert" size={headerIconSize} color={colors.text.inverse} />}
          size={headerIconSize + 4}
        />
      </Badge>
    </Pressable>
  );
}