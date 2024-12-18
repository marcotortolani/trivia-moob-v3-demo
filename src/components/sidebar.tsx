import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { NavLink } from 'react-router-dom'
import { useConfigStore } from '@/lib/config-store'
import { useGameStore } from '@/lib/game-store'
import { hexToRgb } from '@/lib/utils'

import goldenRing from '@/assets/img/default/anillo-ruleta.webp'
import mediaMoob from '@/assets/img/default/logo-media-moob.svg'

import { UserCircle, BadgeInfo, Home } from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { colors, images, user } = useConfigStore()
  const { score } = useGameStore()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className=" w-[95vw] px-2 border-none  rounded-r-2xl "
        style={{
          background: `linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(${hexToRgb(
            colors.secondary
          )}, 0.9))`,
        }}
      >
        <SheetHeader>
          <SheetTitle className="w-full flex items-center justify-evenly">
            <button
              type="button"
              onClick={onClose}
              className=" w-8 h-8 font-mono text-xl rounded-full"
              style={{ backgroundColor: colors.primary, color: colors.text }}
            >
              X
            </button>
            <img src={images.es.logoHeader} alt="logo" className=" w-3/4" />
          </SheetTitle>
        </SheetHeader>
        <div className="w-full  flex items-center justify-center ">
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
                alt=""
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
            <img src={images.backgroundPointsMenu} alt="medal" />
            <span
              className="absolute ml-5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-oswaldBold"
              style={{ color: colors.text }}
            >
              {score}
            </span>
          </div>
        </div>
        <div
          className="grid gap-5 py-8"
          style={{
            color: colors.text,
          }}
        >
          <NavLinkStyled to="/">
            <Home className="" stroke={colors.primary} /> Inicio
          </NavLinkStyled>
          <NavLinkStyled to="/profile">
            <UserCircle className="" stroke={colors.primary} /> Mi Perfil
          </NavLinkStyled>
          <NavLinkStyled to="/ranking">
            <UserCircle className="" stroke={colors.primary} />
            Objetivos - Ranking
          </NavLinkStyled>
          <NavLinkStyled to="/tutorial">
            <UserCircle className="" stroke={colors.primary} />
            ¿Cómo Jugar?
          </NavLinkStyled>
          <NavLinkStyled to="/about">
            <BadgeInfo className="" stroke={colors.primary} />
            Acerca de...
          </NavLinkStyled>
          <NavLinkStyled to="/terms">
            <UserCircle className="" stroke={colors.primary} />
            Bases y Condiciones
          </NavLinkStyled>
          <NavLinkStyled to="/rewards">
            <UserCircle className="" stroke={colors.primary} />
            Premios
          </NavLinkStyled>
        </div>

        <SheetFooter
          className=" absolute bottom-0 left-0 w-full py-5 flex items-center justify-center gap-4"
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
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  const { colors } = useConfigStore()
  return (
    <NavLink
      to={to}
      className={` flex items-center gap-5 font-oswaldRegular text-xl text-left px-4  `}
      style={({ isActive }) => ({
        color: isActive ? colors.primary : 'inherit',
      })}
    >
      {children}
    </NavLink>
  )
}
