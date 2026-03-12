import { Avatar, Col, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { listItemAvatarSize, useStyles } from "../../AppStyles";
import { theme } from "../theme/theme";
import { imageExists, useBreakpoint } from "../utils";

type GenericListItemProps = {
  readonly item: any,
  readonly onPress: (item: Object) => void,
  readonly logoProperty?: string,
  readonly titleProperty?: string,
  readonly titleNode: React.ReactNode,
  readonly subtitleNode: React.ReactNode,
  readonly descriptionNode?: React.ReactNode,
  readonly genericAvatar: React.ReactNode,
  readonly borderColor?: string | null
}

export default function GenericListItem({
  item,
  onPress,
  logoProperty = 'Logo',
  titleProperty = 'Nombre',
  titleNode = null,
  subtitleNode = null,
  descriptionNode = null,
  genericAvatar,
  borderColor = null
}: GenericListItemProps) {

  const styles = useStyles();
  const [exists, setExists] = useState(false);
  const logo = useMemo(() => {
    return exists ? <img alt={item[titleProperty]} src={`./assets/${item[logoProperty]}`} /> : genericAvatar;
  }, [item, logoProperty, exists, genericAvatar, titleProperty]);
  const { isMobile } = useBreakpoint();
  const platform = isMobile ? 'mobile' : 'web';

  useEffect(() => {
    (async () => {
      const temp = await imageExists(`./assets/${item[logoProperty]}`);
      setExists(temp);
    })();
  }, [item, logoProperty]);

  return (
    <Pressable
      testID="list-item"
      key={item.id}
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.listItem,
        { opacity: pressed ? 0.9 : 1 },
        (borderColor && platform === 'web') ? { borderLeftWidth: theme.spacing.xs, borderColor } : { borderLeftWidth: 0 },
      ]}
    >
      <View style={innerStyles.listItemInner}>
        <Row gutter={theme.spacing.xl}>
          <Col span={4}>
            {logo && <Avatar shape="square" src={logo} size={listItemAvatarSize} />}
          </Col>
          <Col span={20}>
            <View style={innerStyles.row}>
              {/* LEFT */}
              <View style={innerStyles.left}>
                {titleNode}
                {descriptionNode}
              </View>

              {/* RIGHT */}
              <View style={innerStyles.right}>
                {subtitleNode}
              </View>
            </View>
          </Col>
        </Row>
      </View>
    </Pressable>
  );
}

const innerStyles = StyleSheet.create({
  listItemInner: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
});