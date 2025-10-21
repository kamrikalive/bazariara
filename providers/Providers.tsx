'use client'
import React from 'react'
import { UserProvider } from './UserProvider'
import { CartProvider } from './CartProvider'
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UserProvider>
  )
}
