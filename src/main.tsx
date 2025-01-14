import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Loading from './components/loading.tsx'
import './index.css'
import { App } from './App.tsx'

import configData from '@/data/config.json'

createRoot(document.getElementById('root')!).render(
  <StrictMode>{configData ? <App configData={configData} /> : <Loading />}</StrictMode>
)
