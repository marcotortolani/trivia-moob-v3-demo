import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfigStore } from '@/lib/config-store'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

//import './terms-styles.css'

const urlTerms =
  'http://ve.movistar.queguayviajes.com/terminos-y-condiciones-trivia/'

//const urlTerms = 'https://sopraelas.vm.co.mz/regulamento-do-passatempo/'

export default function Terms() {
  const { colors } = useConfigStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [content, setContent] = useState('')

  const proxy = 'https://cors-anywhere.herokuapp.com/'

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${proxy}${urlTerms}`)
        const html = await response.text()

        // Parsear el HTML y extraer solo el contenido del <body>
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        // Seleccionar el contenido del div con clase "content_inner"
        const contentInner = doc.querySelector('.content_inner')

        // Guardar el contenido HTML del div en el estado
        if (contentInner) {
          setContent(contentInner.innerHTML)
        } else {
          console.error("No se encontró el div con la clase 'content_inner'")
        }
      } catch (error) {
        console.error('Error al obtener el contenido:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="home-page"
        layout
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5 } }}
        className={` relative h-screen min-h-[100dvh] flex flex-col overflow-hidden `}
        style={{
          background: `linear-gradient(to bottom, ${colors.secondary}, #000)`,
        }}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        {/* <h2
          className=" mx-auto text-2xl font-bold text-center mb-2"
          style={{ color: colors.text }}
        >
          Términos y Condiciones
        </h2> */}

        <div dangerouslySetInnerHTML={{ __html: content }} />

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </motion.main>
    </AnimatePresence>
  )
}
