import { JSX } from 'react';
import LayoutMobile from "../../layouts/LayoutMobile";
import LayoutWeb from "../../layouts/LayoutWeb";
import {useBreakpoint} from "../../utils/utils";
import DashboardMobile from "./DashboardMobile";
import DashboardWeb from "./DashboardWeb";

export default function Dashboard(): JSX.Element {
  const {isMobile, height, width} = useBreakpoint();
  console.log(isMobile, height, width)

  if (isMobile) {
    return (
      <LayoutMobile>
        <DashboardMobile />
      </LayoutMobile>
    );
  }

  return (
    <LayoutWeb>
      <DashboardWeb />
    </LayoutWeb>
  );
}