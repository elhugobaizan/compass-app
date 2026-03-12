import HomeMobile from "./HomeMobile"
import HomeWeb from "./HomeWeb"
import { useBreakpoint } from "../../utils/utils"

export default function Home() {
  const isMobile = useBreakpoint().isMobile

  return isMobile ? <HomeMobile /> : <HomeWeb />
}