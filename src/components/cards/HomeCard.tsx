import { colors } from "../../theme/colors";

type HomeCardVariant = 'hero' | 'default' | 'compact';
type HomeCardPlatform = 'mobile' | 'web';

type HomeCardProps = {
  readonly style?: object;
  readonly title?: React.ReactNode | string;
  readonly value: React.ReactNode | string;
  readonly actions?: React.ReactNode | null;
  readonly titleDivider?: boolean;
  readonly fixed?: boolean;
  readonly min?: number;
  readonly icon?: React.ReactNode;
  readonly titleStyle?: object;
  readonly valueStyle?: object;
  readonly onPress?: () => void;
  readonly variant?: HomeCardVariant;
  /** 'mobile' = sombra, radius y padding estándar; 'web' = estilo simple, compacto, sin sombra ni elevación. */
  readonly platform?: HomeCardPlatform;
  /** When true, do not wrap in Col so the card fills the parent column (e.g. in header layouts). */
  readonly fillColumn?: boolean;
  readonly children?: React.ReactNode;
};

function resolveHomeCardStyleMobile(
  variant: HomeCardVariant,
  styles: ReturnType<any>
) {
  switch (variant) {
    case 'hero':
      return styles.homeCardHero;

    case 'compact':
      return styles.homeCardCompact;

    case 'default':
    default:
      return styles.homeCard;
  }
}

function resolveHomeCardStyleWeb(
  variant: HomeCardVariant,
  styles: ReturnType<any>
) {
  switch (variant) {
    case 'hero':
      return styles.homeCardHeroWeb;

    case 'compact':
      return styles.homeCardCompactWeb;

    case 'default':
    default:
      return styles.homeCardWeb;
  }
}

function resolveTitleStyle(
  variant: HomeCardVariant,
  styles: ReturnType<any>
) {
  switch (variant) {
    case 'hero':
      return styles.homeHeroTitle;

    case 'compact':
      return { fontSize: 13, fontWeight: 600, color: colors.text.primary };

    case 'default':
    default:
      return { fontSize: 14, fontWeight: 600, color: colors.text.primary };
  }
}

function resolveValueStyle(
  variant: HomeCardVariant,
  styles: ReturnType<any>
) {
  switch (variant) {
    case 'hero':
      return styles.homeHeroValue;

    case 'compact':
      return styles.homeValueMuted;

    case 'default':
    default:
      return styles;
  }
}

function resolveCardStyleByVariant(
  variant: HomeCardVariant,
  platform: HomeCardPlatform,
  styles: ReturnType<any>
) {
  if (platform === 'web') {
    switch (variant) {
      case 'hero':
        return styles.homeCardHeroWeb;
      case 'compact':
        return styles.homeCardCompactWeb;
      case 'default':
      default:
        return styles.homeCardWeb;
    }
  } else {
    switch (variant) {
      case 'hero':
        return styles.homeCardHero;
      case 'compact':
        return styles.homeCardCompact;
      case 'default':
      default:
        return styles.homeCard;
    }
  }
}

type CardContentOptions = { onPress?: () => void; skipPressOpacity?: boolean };

type CardContentParams = {
  cardStyle: object;
  resolvedTitleStyle: object;
  resolvedValueStyle: object;
  title: string | React.ReactNode | null;
  actions: React.ReactNode | null;
  titleDivider: boolean;
  value: React.ReactNode | string;
  icon: React.ReactNode | null;
  options: CardContentOptions;
  children: React.ReactNode | null;
};

const cardContent = (params: CardContentParams): React.ReactNode => {
  const { cardStyle, resolvedTitleStyle, resolvedValueStyle, title, actions, titleDivider, value, icon, options, children } = params;
  return (
    <div onClick={options.onPress}>
      <div style={{ backgroundColor: colors.background.card }}> {/* cardStyle */}
        {icon && <div style={{ marginRight: 16 }}>{icon}</div>}
        <div style={{ flex: 1, minWidth: 0 }}>
          {(title || actions) && <div>
            <div>{typeof title === 'string' ? <span style={resolvedTitleStyle}>{title}</span> : title}</div>
            <div style={{ textAlign: "end" }}>{actions}</div>
          </div>}
          {titleDivider && <div><div><hr style={{ margin: "6px 0" }} /></div></div>}
          <div><div><div style={{ marginTop: 8, marginBottom: 16 }}>
            {typeof value === 'string' ? (
              <span style={resolvedValueStyle}>{value}</span>
            ) : (
              value
            )}
          </div></div></div>
          <div><div>{children}</div></div>
        </div>
      </div>
    </div>
  );
};

export default function HomeCard({
  style = {},
  title = "",
  actions = null,
  titleDivider = false,
  value,
  fixed = false,
  min = 8,
  icon = null,
  titleStyle,
  valueStyle,
  onPress,
  variant = 'default',
  platform = 'mobile',
  fillColumn = false,
  children,
}: HomeCardProps) {

  const cardStyle = [resolveCardStyleByVariant(variant, platform, {}), { flexDirection: 'row', width: '100%', backgroundColor: colors.background.card }, style];
  const heroTitleStyle = platform === 'web' ? "styles.homeHeroTitleWeb" : "styles.homeHeroTitleMobile";
  const resolvedTitleStyle = titleStyle ?? (variant === 'hero' ? heroTitleStyle : resolveTitleStyle(variant, {}));
  const heroValueStyle = platform === 'web' ? "styles.homeHeroValueWeb" : "styles.homeHeroValueMobile";
  const resolvedValueStyle = valueStyle ?? (variant === 'hero' ? heroValueStyle : resolveValueStyle(variant, {}));
  const content = cardContent({
    cardStyle,
    resolvedTitleStyle,
    resolvedValueStyle,
    title,
    actions,
    titleDivider,
    value,
    icon,
    options: { onPress, skipPressOpacity: platform === 'web' },
    children,
  });

  if (fillColumn) {
    return <div style={{ width: '100%' }}>{content}</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      {content}
    </div>
  );
}
