import { useConfigStore } from '@/lib/config-store'

const SectionTitle = ({ title }: { title: string }) => {
  const { colors } = useConfigStore()
  return (
    <h3
      className=" text-sm xs:text-base uppercase font-oswaldBold"
      style={{ color: colors?.text || '#FFF' }}
    >
      {title}
    </h3>
  )
}

export default SectionTitle
