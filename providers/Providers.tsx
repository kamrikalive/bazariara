'use client'
import React from 'react'
import { UserProvider } from './UserProvider'
import { CartProvider } from './CartProvider'
import { OrderProvider } from '@/contexts/OrderContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  )
}
