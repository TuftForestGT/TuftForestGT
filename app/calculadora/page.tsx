import type { Metadata } from 'next'
import CalculadoraClient from './CalculadoraClient'
import PasswordGate from './PasswordGate'

export const metadata: Metadata = {
  title: 'Calculadora de Alfombras | TuftForest GT',
}

export default function CalculadoraPage() {
  return (
    <PasswordGate>
      <CalculadoraClient />
    </PasswordGate>
  )
}
