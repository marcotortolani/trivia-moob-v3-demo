import useSound from 'use-sound'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { hexToRgb } from '@/lib/utils'

import mediaMoob from '/img/default/logo-media-moob.svg'

import { X } from 'lucide-react'
import {
  HomeIcon,
  ProfileIcon,
  RankingIcon,
  TutorialIcon,
  TermsIcon,
  AboutIcon,
  RewardsIcon,
} from '@/lib/icons'

import swoosh from '@/assets/sound/swoosh.mp3'
import blopSound from '@/assets/sound/blop.mp3'
import UserAvatar from './profile/user-avatar'
import FallbackImage from './fallback-image'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const {
    colors,
    images,
    user,
    links,
    soundActive,
    dictionary,
    lang,
    setLang,
  } = useConfigStore()
  const { score } = useGameStore()
  const navigate = useNavigate()

  const [playSwoosh] = useSound(swoosh)

  const currentYear = new Date().getFullYear()

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
        className=" z-[200] w-[94%] md:max-w-[450px] lg:w-1/2 lg:max-w-[450px] h-[100dvh] overflow-y-scroll md:overflow-hidden px-0 border-r-2 border-gray-200/30  rounded-r-2xl md:rounded-r-3xl flex flex-col justify-between "
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(${hexToRgb(
            colors.background
          )}, 0.9))`,
        }}
      >
        <SheetHeader>
          <SheetTitle className="w-full px-1 flex items-center justify-evenly">
            <button
              type="button"
              onClick={onCloseSidebar}
              className=" w-8 h-8 p-0.5 font-mono text-xl rounded-full"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              <X className=" w-full h-full" />
            </button>
            <img src={images.es.logoHeader} alt="logo" className=" w-3/4" />
          </SheetTitle>
        </SheetHeader>

        <div className="w-full px-2 flex flex-col items-center justify-center lg:gap-12">
          <div className="w-full px-2 flex items-center justify-center ">
            <div className=" w-1/3  flex flex-col items-center justify-center ">
              <UserAvatar />

              <span
                className=" font-oswaldMedium uppercase tracking-wider "
                style={{ color: colors.text }}
              >
                {user.userName}
              </span>
            </div>
            <div className=" ml-1 mr-3 w-[1px] h-16 bg-neutral-400 content-normal"></div>
            <div className=" relative w-2/3 mx-auto  ">
              <FallbackImage
                primaryImage={images.backgroundPointsMenu}
                fallbackImage={images.backgroundPoints}
                alt="background points"
              />
              <span
                className="absolute ml-2 xs:ml-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl xs:text-2xl md:text-3xl font-oswaldBold"
                style={{ color: colors.text }}
              >
                {score}
              </span>
            </div>
          </div>

          <div className="mt-4 xl:mt-0 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setLang('es')}
              className=" w-12 h-8 p-0.5 pt-1 font-tekoMedium text-xl rounded-full"
              style={{
                backgroundColor:
                  lang === 'es' ? colors.primary : colors.secondary,
                color: colors.text,
              }}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className=" w-12 h-8 p-0.5 pt-1 font-tekoMedium text-xl rounded-full"
              style={{
                backgroundColor:
                  lang === 'en' ? colors.primary : colors.secondary,
                color: colors.text,
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('pt')}
              className=" w-12 h-8 p-0.5 pt-1 font-tekoMedium text-xl rounded-full"
              style={{
                backgroundColor:
                  lang === 'pt' ? colors.primary : colors.secondary,
                color: colors.text,
              }}
            >
              PT
            </button>
          </div>

          <div
            className="w-full xs:px-2 min-h-fit grid gap-5 lg:gap-6 py-8 xl:py-2"
            style={{
              color: colors.text,
            }}
          >
            <NavLinkStyled to="/" onNavLink={handleNavLink}>
              <HomeIcon width={24} height={24} fill={colors.primary} />
              {dictionary['Home']}
            </NavLinkStyled>
            <NavLinkStyled to="/profile" onNavLink={handleNavLink}>
              <ProfileIcon width={24} height={24} fill={colors.primary} />
              {dictionary['My profile']}
            </NavLinkStyled>
            <NavLinkStyled to="/ranking" onNavLink={handleNavLink}>
              <RankingIcon width={24} height={24} fill={colors.primary} />
              {/* {dictionary['Goals and Ranking']} */}
              {dictionary['Goals']}
            </NavLinkStyled>
            <NavLinkStyled to="/how-to-play" onNavLink={handleNavLink}>
              <TutorialIcon width={24} height={24} fill={colors.primary} />
              {dictionary['How to play?']}
            </NavLinkStyled>
            <NavLinkStyled to="/faq" onNavLink={handleNavLink}>
              <AboutIcon width={24} height={24} fill={colors.primary} />
              {dictionary['FAQs']}
            </NavLinkStyled>
            <NavLinkStyled
              to={links.termsURL}
              onNavLink={() => {
                window.open(links.termsURL, '_blank')
              }}
            >
              <TermsIcon width={24} height={24} fill={colors.primary} />
              {dictionary['Terms and Conditions']}
            </NavLinkStyled>
            <NavLinkStyled to="/rewards" onNavLink={handleNavLink}>
              <RewardsIcon width={24} height={24} fill={colors.primary} />
              {dictionary['Rewards']}
            </NavLinkStyled>
          </div>
        </div>
        <SheetDescription
          style={{ transform: 'scale(0)', display: 'none' }}
        ></SheetDescription>

        <SheetFooter
          className="  w-full py-5 flex flex-col items-center justify-center gap-2 xs:gap-1"
          style={{
            borderTop: `1px solid ${colors.primary}`,
          }}
        >
          <div className=" w-full flex flex-col xs:flex-row items-center justify-center gap-1 xs:gap-4">
            <img
              src={mediaMoob}
              alt="Media Moob Logo white"
              className="w-1/3 invert  "
            />
            <p
              className=" text-sm md:text-base font-oswaldLight tracking-wider"
              style={{ color: colors.text }}
            >
              {dictionary['Another solution by Media Moob']}
            </p>
          </div>
          <p
            className=" text-xs font-oswaldLight tracking-wider uppercase"
            style={{ color: colors.text }}
          >
            {dictionary['All rights reserved']} - {currentYear}
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
  const { colors, soundActive } = useConfigStore()

  const [playBlop] = useSound(blopSound)

  const isActive = location.pathname === to

  return (
    <Link
      to={''}
      onClick={() => {
        if (soundActive) playBlop()
        onNavLink(to)
      }}
      className={`${
        isActive
          ? ' font-oswaldBold text-lg xs:text-2xl '
          : ' font-oswaldRegular text-base xs:text-xl '
      } flex items-center gap-5 text-left tracking-wider px-4  `}
      style={{
        color: isActive ? colors.primary : colors.text,
      }}
    >
      {children}
    </Link>
  )
}
