import { colors } from "../../theme/colors";
import { AlertGlyph } from "./AlertGlyph";
import { BankGlyph } from "./BankGlyph";
import { CalendarGlyph } from "./CalendarGlyph";
import { ExpenseGlyph } from "./ExpenseGlyph";
import { ExpensesGlyph } from "./ExpensesGlyph";
import { GoalArrow } from "./GoalArrow";
import { HomeGlyph } from "./HomeGlyph";
import { IncomeGlyph } from "./IncomeGlyph";
import { InvestmentGlyph } from "./InvestmentGlyph";
import { LiquidityGlyph } from "./LiquidityGlyph";
import { TaxGlyph } from "./TaxGlyph";
import { TransferGlyph } from "./TransferGlyph";
import { TravelGlyph } from "./TravelGlyph";
import { TrendArrow } from "./TrendArrow";
import { GlyphProps } from "./types";
import { UserGlyph } from "./UserGlyph";
import { WalletGlyph } from "./WalletGlyph";

type IconName =
  | "home"
  | "wallet"
  | "bank"
  | "transfer"
  | "trend"
  | "goal"
  | "liquidity"
  | "investment"
  | "expenses"
  | "expense"
  | "income"
  | "tax"
  | "calendar"
  | "travel"
  | "alert"
  | "user";

export function CompassIcon({ name, size = 20, color = colors.neutral[500] }: GlyphProps) {
  switch (name as IconName) {

    case "home":
      return <HomeGlyph size={size} color={color} />;

    case "wallet":
      return <WalletGlyph size={size} color={color} />;

    case "bank":
      return <BankGlyph size={size} color={color} />;

    case "transfer":
      return <TransferGlyph size={size} color={color} />;

    case "trend":
      return <TrendArrow size={size} color={color} />;

    case "goal":
      return <GoalArrow size={size} color={color} />;

    case "liquidity":
      return <LiquidityGlyph size={size} color={color} />;

    case "investment":
      return <InvestmentGlyph size={size} color={color} />;

    case "expense":
      return <ExpenseGlyph size={size} color={color} />;

    case "expenses":
      return <ExpensesGlyph size={size} color={color} />;
    case "income":
      return <IncomeGlyph size={size} color={color} />;

    case "tax":
      return <TaxGlyph size={size} color={color} />;

    case "calendar":
      return <CalendarGlyph size={size} color={color} />;

    case "travel":
      return <TravelGlyph size={size} color={color} />;

    case "alert":
      return <AlertGlyph size={size} color={color} />;

    case "user":
      return <UserGlyph size={size} color={color} />;

    default:
      return <HomeGlyph size={size} color={color} />;
  }
}