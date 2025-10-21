'use client'
import React, { createContext, useState, useMemo } from 'react'
export const CartContext = createContext<any>({})
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<any[]>([])
  const totalPrice = useMemo(()=> items.reduce((s,i)=>s + (i.price||0),0),[items])
  const value = { items, setItems, totalPrice }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
