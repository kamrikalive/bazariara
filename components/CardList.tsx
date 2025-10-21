'use client'
import React from 'react'
import Card from './Card'

interface CardListProps {
  items: any[]
}

export default function CardList({ items }: CardListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {items.map((item) => (
        <Card
          key={item.id}
          title={item.title}
          imageUrl={item.imageUrl}
          price={item.price}
        />
      ))}
    </div>
  )
}
