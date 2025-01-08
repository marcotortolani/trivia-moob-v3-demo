import { useConfigStore } from '@/lib/config-store'
import goldenRing from '/img/default/anillo-ruleta.webp'
import { User } from 'lucide-react'
export default function UserAvatar() {
  const { colors, user } = useConfigStore()
  return (
    <>
      {user.userAvatar ? (
        <div className="relative w-full h-full aspect-square">
          <img
            src={goldenRing}
            alt="Ring wheel"
            className=" absolute z-50 w-full h-full p-1   "
          />
          <img
            className="w-full h-full p-2 bg-black/0 backdrop-brightness-150 rounded-full "
            src={user.userAvatar}
            alt="Image User Avatar"
          />
        </div>
      ) : (
        <User
          size={50}
          stroke={colors.text}
          className="w-full h-full p-4 rounded-full"
          style={{ background: colors.primary, color: colors.text }}
        />
      )}
    </>
  )
}
