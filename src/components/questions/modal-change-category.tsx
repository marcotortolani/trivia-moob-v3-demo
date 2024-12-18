import { motion } from 'framer-motion'

interface ModalChangeCategoryProps {
  onRoulette: () => void
  onCloseModal: () => void
  onDontAskAgain: () => void
}

const ModalChangeCategory: React.FC<ModalChangeCategoryProps> = ({
  onRoulette,
  onCloseModal,
  onDontAskAgain,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4 text-black">Change Category</h2>

        <button
          onClick={onRoulette}
          className="mt-4 w-full bg-blue-400 py-2 rounded hover:bg-gray-300"
        >
          Girar la ruleta
        </button>

        <button
          onClick={onCloseModal}
          className="mt-4 w-full bg-blue-400 py-2 rounded hover:bg-gray-300"
        >
          Continuar misma categoría
        </button>

        <button
          onClick={onDontAskAgain}
          className="mt-4 w-full bg-red-400 py-2 rounded hover:bg-gray-300"
        >
          No preguntar de nuevo
        </button>
      </motion.div>
    </motion.div>
  )
}

export default ModalChangeCategory
