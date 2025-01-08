import useSound from 'use-sound'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
} from '@/components/ui/sheet'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { hexToRgb } from '@/lib/utils'

import goldenRing from '/img/default/anillo-ruleta.webp'
import mediaMoob from '/img/default/logo-media-moob.svg'

import {
  HomeIcon,
  ProfileIcon,
  RankingIcon,
  TutorialIcon,
  TermsIcon,
  AboutIcon,
  RewardsIcon,
} from '@/lib/icons'

import swoosh from '../assets/sound/swoosh.mp3'
import blopSound from '../assets/sound/blop.mp3'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { colors, images, user, links, soundActive } = useConfigStore()
  const { score } = useGameStore()
  const navigate = useNavigate()

  const [playSwoosh] = useSound(swoosh)

  const handleNavLink = (href: string) => {
    setTimeout(() => {
      onCloseSidebar()
    }, 50)
    setTimeout(() => {
      navigate(href)
    }, 300)
  }

  const onCloseSidebar = () => {
    if (soundActive) playSwoosh()
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onCloseSidebar}>
      <SheetOverlay className=" backdrop-blur-sm bg-black/20" />
      <SheetContent
        side="left"
        className=" z-[200] w-[95vw] h-[100dvh] overflow-y-scroll md:overflow-auto px-0 border-r-2 border-gray-200/30  rounded-r-2xl md:rounded-r-3xl flex flex-col justify-between "
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(${hexToRgb(
            colors.secondary
          )}, 0.9))`,
        }}
      >
        <SheetHeader>
          <SheetTitle className="w-full px-2 flex items-center justify-evenly">
            <button
              type="button"
              onClick={onCloseSidebar}
              className=" w-8 h-8 font-mono text-xl rounded-full"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              X
            </button>
            <img src={images.es.logoHeader} alt="logo" className=" w-3/4" />
          </SheetTitle>
        </SheetHeader>

        <div className="w-full px-2 flex flex-col items-center justify-center lg:gap-16">
          <div className="w-full px-2 flex items-center justify-center ">
            <div className=" w-1/3  flex flex-col items-center justify-center ">
              <div className=" relative w-4/6 max-w-[100px] aspect-square">
                <img
                  src={goldenRing}
                  alt="Ring wheel"
                  className=" absolute z-50 w-full h-full p-1  "
                />
                <img
                  className="w-full h-full p-2"
                  src={images.avatars[0]}
                  alt="Image User Avatar"
                />
              </div>
              <span
                className=" font-oswaldMedium uppercase tracking-wider "
                style={{ color: colors.text }}
              >
                {user.userName}
              </span>
            </div>
            <div className=" ml-1 mr-3 w-[1px] h-16 bg-neutral-400 content-normal"></div>
            <div className=" relative w-2/3 mx-auto  ">
              <img src={images.backgroundPointsMenu} alt="background points" />
              <span
                className="absolute ml-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-oswaldBold"
                style={{ color: colors.text }}
              >
                {score}
              </span>
            </div>
          </div>

          <div
            className="w-full px-2 min-h-fit grid gap-5 lg:gap-8 py-8"
            style={{
              color: colors.text,
            }}
          >
            <NavLinkStyled to="/" onNavLink={handleNavLink}>
              <HomeIcon width={24} height={24} fill={colors.primary} />
              Inicio
            </NavLinkStyled>
            <NavLinkStyled to="/profile" onNavLink={handleNavLink}>
              <ProfileIcon width={24} height={24} fill={colors.primary} />
              Mi Perfil
            </NavLinkStyled>
            <NavLinkStyled to="/ranking" onNavLink={handleNavLink}>
              <RankingIcon width={24} height={24} fill={colors.primary} />
              Objetivos - Ranking
            </NavLinkStyled>
            <NavLinkStyled to="/how-to-play" onNavLink={handleNavLink}>
              <TutorialIcon width={24} height={24} fill={colors.primary} />
              ¿Cómo Jugar?
            </NavLinkStyled>
            <NavLinkStyled to="/faq" onNavLink={handleNavLink}>
              <AboutIcon width={24} height={24} fill={colors.primary} />
              Preguntas Frecuentes
            </NavLinkStyled>
            <NavLinkStyled
              to={links.termsURL}
              onNavLink={() => {
                window.open(links.termsURL, '_blank')
              }}
            >
              <TermsIcon width={24} height={24} fill={colors.primary} />
              Bases y Condiciones
            </NavLinkStyled>
            <NavLinkStyled to="/rewards" onNavLink={handleNavLink}>
              <RewardsIcon width={24} height={24} fill={colors.primary} />
              Premios
            </NavLinkStyled>
          </div>
        </div>

        <SheetFooter
          className="  w-full py-5 flex items-center justify-center gap-4"
          style={{
            borderTop: `1px solid ${colors.primary}`,
          }}
        >
          <img
            src={mediaMoob}
            alt="Media Moob Logo white"
            className="w-1/4 invert  "
          />
          <p
            className=" font-oswaldLight 2tracking-wide "
            style={{ color: colors.text }}
          >
            Otra solución de Media Moob
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function NavLinkStyled({
  to,
  onNavLink,
  children,
}: {
  to: string
  onNavLink: (to: string) => void
  children: React.ReactNode
}) {
  const location = useLocation()
  const { colors } = useConfigStore()

  const [playBlop] = useSound(blopSound)

  const isActive = location.pathname === to

  return (
    <Link
      to={''}
      onClick={() => {
        playBlop()
        onNavLink(to)
      }}
      className={`${
        isActive ? ' font-oswaldBold text-2xl ' : ' font-oswaldRegular text-xl '
      } flex items-center gap-5 text-left tracking-wider px-4  `}
      style={{
        color: isActive ? colors.primary : colors.text,
      }}
    >
      {children}
    </Link>
  )
}
