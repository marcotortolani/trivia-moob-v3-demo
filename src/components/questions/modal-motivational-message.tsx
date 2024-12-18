import { motion } from 'framer-motion'
import ENCOURAGING_MESSAGES from '@/data/encouraging-messages.json'

type ValidSizes = keyof (typeof ENCOURAGING_MESSAGES)['correct' | 'incorrect']
export type EncouragingMessage = (typeof ENCOURAGING_MESSAGES)[
  | 'correct'
  | 'incorrect'][ValidSizes]

interface ModalEncouragingMessageProps {
  encouragingMessage: EncouragingMessage | null
}

const ModalMotivationalMessage: React.FC<ModalEncouragingMessageProps> = ({
  encouragingMessage,
}) => {
  if (!encouragingMessage) return null

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
        className="bg-white rounded-lg p-6 max-w-md w-full text-center"
      >
        <h2 className="text-2xl text-black font-bold mb-4">
          {encouragingMessage?.title}
        </h2>
        <p className="text-lg mb-6 text-black">
          {encouragingMessage?.longMessage}
        </p>
        <p className="text-sm font-medium mb-6 text-black">
          {encouragingMessage?.shortMessage}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ModalMotivationalMessage
