import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useGameStore } from '@/lib/game-store'
import { useConfigStore } from '@/lib/config-store'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trophy } from 'lucide-react'

export function Footer() {
  const { score } = useGameStore()
  const { colors, images } = useConfigStore()

  return (
    <motion.footer
      initial={{ y: 200 }}
      animate={{ y: -5, transition: { duration: 0.5 } }}
      className="z-20 px-4"
    >
      <div className="flex justify-between items-end gap-4 max-w-3xl mx-auto ">
        <Link to="/terms">
          <Button
            variant="ghost"
            className=" w-16 h-fit p-0 flex flex-col items-center uppercase font-oswaldBold text-sm focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
            style={{ color: colors.text }}
          >
            <img
              src={images.termsButton}
              alt="Logo"
              className=" w-full h-auto"
            />
            Bases
          </Button>
        </Link>

        <div className="relative w-4/6 flex flex-col items-center text-center bg-red-500/0">
          <div
            className="w-full max-w-[400px] aspect-[600/246] flex items-end justify-center text-4xl font-bold text-center text-white mb-1"
            style={{
              backgroundImage: `url(${images.backgroundPoints})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <span className=" h-full font-oswaldMedium flex items-center pt-3 ">
              {score}
            </span>
          </div>
          <div className=" font-oswaldMedium tracking-widest text-white text-sm">
            PUNTAJE
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild className=" p-0">
            <Button
              variant="ghost"
              className=" w-16 h-fit p-0 flex flex-col items-center uppercase font-oswaldBold text-sm focus:bg-transparent hover:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:hover:bg-transparent active:scale-110 transition-all duration-150 ease-in-out"
              style={{ color: colors.text }}
            >
              <img
                src={images.rewardsButton}
                alt="Logo"
                className=" w-full h-auto"
              />
              PREMIOS
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Premios Disponibles</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4 p-4 border  border-gray-700 rounded-lg dark:border-neutral-800">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-bold">Premio 1</h3>
                  <p className="text-sm text-gray-400">100,000 puntos</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border  border-gray-700 rounded-lg dark:border-neutral-800">
                <Trophy className="h-8 w-8 text-gray-400" />
                <div>
                  <h3 className="font-bold">Premio 2</h3>
                  <p className="text-sm text-gray-400">50,000 puntos</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border  border-gray-700 rounded-lg dark:border-neutral-800">
                <Trophy className="h-8 w-8 text-amber-700" />
                <div>
                  <h3 className="font-bold">Premio 3</h3>
                  <p className="text-sm text-gray-400">25,000 puntos</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.footer>
  )
}
