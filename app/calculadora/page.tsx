import type { Metadata } from 'next'
import CalculadoraClient from './CalculadoraClient'

export const metadata: Metadata = {
  title: 'Calculadora de Alfombras | TuftForest GT',
}

export default function CalculadoraPage() {
  return <CalculadoraClient />
}
