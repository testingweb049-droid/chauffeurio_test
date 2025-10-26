'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { OrderProps } from '@/types/OrderProps' // adjust the path as needed

interface OrderContextType {
  order: OrderProps | null
  setOrder: (order: OrderProps) => void
}

const OrderContext = createContext<OrderContextType | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [order, setOrder] = useState<OrderProps | null>(null)

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrderContext() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrderContext must be used inside <OrderProvider>')
  }
  return context
}
