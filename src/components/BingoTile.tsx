"use client"

import type React from "react"
import type { BingoTile as BingoTileType } from "../types"

interface BingoTileProps {
  tile: BingoTileType
  onMark: (tileId: number) => void
  disabled: boolean
}

export const BingoTile: React.FC<BingoTileProps> = ({ tile, onMark, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onMark(tile.id)
    }
  }

  return (
      <div
          className={`
        aspect-square border-2 p-2 text-xs flex flex-col items-center justify-center text-center cursor-pointer transition-all relative
        ${tile.marked ? "bg-green-500 text-white border-green-600" : "bg-white hover:bg-gray-50 border-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-60" : "hover:border-blue-400"}
      `}
          onClick={handleClick}
      >
        {tile.event.image_url && (
            <img src={tile.event.image_url || "/placeholder.svg"} alt="" className="w-8 h-8 object-cover rounded mb-1" />
        )}
        <span className="leading-tight">{tile.event.description}</span>
        {tile.marked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
        )}
      </div>
  )
}
