"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { BingoCard, BingoTile as BingoTileType } from "../types"
import { BingoTile } from "./BingoTile"
import { apiClient } from "../lib/api"

interface BingoBoardProps {
  card: BingoCard
  onCardUpdate: () => void
}

export const BingoBoard: React.FC<BingoBoardProps> = ({ card, onCardUpdate }) => {
  const [hasBingo, setHasBingo] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [localTiles, setLocalTiles] = useState<BingoTileType[]>(card.tiles)

  const gridSize = Math.sqrt(card.tiles.length)
  const isGameFinished = card.game_status.is_finished
  const isUserWinner = card.game_status.is_user_winner
  const winnerUser = card.game_status.winner_user

  useEffect(() => {
    setLocalTiles(card.tiles)
  }, [card.tiles])

  useEffect(() => {
    checkBingoStatus()
  }, [localTiles])

  const checkBingoStatus = async () => {
    try {
      const response = await apiClient.hasBingo()
      setHasBingo(response.has_bingo)
    } catch (error) {
      console.error("Error checking bingo status:", error)
    }
  }

  const handleMarkTile = async (tileId: number) => {
    if (isGameFinished || saveLoading) return

    // Optimistic update - immediately update UI
    setLocalTiles((prevTiles) =>
      prevTiles.map((tile) => (tile.id === tileId ? { ...tile, marked: !tile.marked } : tile)),
    )

    setSaveLoading(true)
    try {
      await apiClient.markTile(tileId)
      checkBingoStatus()
    } catch (error) {
      console.error("Error marking tile:", error)
      // Revert optimistic update on error
      setLocalTiles(card.tiles)
    } finally {
      setSaveLoading(false)
    }
  }

  // Dodaj nową funkcję do synchronizacji danych co jakiś czas
  useEffect(() => {
    // Synchronizuj dane co 30 sekund
    const syncInterval = setInterval(() => {
      onCardUpdate()
    }, 30000)

    return () => clearInterval(syncInterval)
  }, [onCardUpdate])

  const handleClaimWin = async () => {
    setClaimLoading(true)
    try {
      await apiClient.claimWin()
      onCardUpdate()
    } catch (error) {
      console.error("Error claiming win:", error)
    } finally {
      setClaimLoading(false)
    }
  }

  // Organize tiles into grid using localTiles for immediate UI updates
  const grid: BingoTileType[][] = []
  for (let i = 0; i < gridSize; i++) {
    grid[i] = []
    for (let j = 0; j < gridSize; j++) {
      const tile = localTiles.find((t) => t.row === i && t.col === j)
      if (tile) grid[i][j] = tile
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Twoja plansza Bingo</h2>

        {isGameFinished && (
          <div className="mb-4 p-4 rounded-lg bg-yellow-100 border border-yellow-400">
            {isUserWinner ? (
              <p className="text-yellow-800 font-semibold">🎉 Gratulacje! Wygrałeś dzisiejszą grę!</p>
            ) : (
              <p className="text-yellow-800">
                🏆 Gra została zakończona. Zwycięzcą dzisiejszego dnia jest:{" "}
                <span className="font-bold">{winnerUser?.name || "Nieznany gracz"}</span>
              </p>
            )}
          </div>
        )}

        {hasBingo && !isGameFinished && (
          <div className="mb-4">
            <div className="p-4 bg-green-100 border border-green-400 rounded-lg mb-4">
              <p className="text-green-800 font-semibold mb-2">🎉 Masz BINGO! Możesz zgłosić wygraną!</p>
              <button
                onClick={handleClaimWin}
                disabled={claimLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              >
                {claimLoading ? "Zgłaszanie..." : "Zgłoś wygraną!"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Overlay loading podczas zapisywania - naprawiony */}
        {saveLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10 rounded-lg"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
          >
            <div className="bg-white rounded-lg p-6 shadow-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">Zapisywanie...</span>
            </div>
          </div>
        )}

        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${gridSize * 120}px`,
          }}
        >
          {grid.flat().map((tile) => (
            <BingoTile key={tile.id} tile={tile} onMark={handleMarkTile} disabled={isGameFinished || saveLoading} />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>Kliknij na pola, aby je zaznaczyć lub odznaczyć. Zdobądź BINGO w rzędzie, kolumnie lub po przekątnej!</p>
      </div>
    </div>
  )
}
