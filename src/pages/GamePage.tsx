"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import type { BingoCard } from "../types"
import { BingoBoard } from "../components/BingoBoard"
import { apiClient } from "../lib/api"
import { Navbar } from "../components/Navbar"

export const GamePage: React.FC = () => {
  const { user } = useAuth()
  const [card, setCard] = useState<BingoCard | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadTodayCard()
  }, [])

  // Zmodyfikuj funkcję loadTodayCard, aby dodać opcjonalny parametr silent
  // który pozwoli na ładowanie danych bez pokazywania stanu ładowania

  const loadTodayCard = async (silent = false) => {
    if (!silent) {
      setLoading(true)
    }
    setError("")

    try {
      const cardData = await apiClient.getTodayCard()
      setCard(cardData)
    } catch (err) {
      if (err instanceof Error && err.message.includes("Nie masz jeszcze planszy")) {
        setError("no_card")
      } else {
        setError(err instanceof Error ? err.message : "Błąd ładowania planszy")
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  // Dodaj nową funkcję do cichego odświeżania danych
  const silentRefresh = () => {
    loadTodayCard(true)
  }

  const createTodayCard = async () => {
    setLoading(true)
    setError("")

    try {
      await apiClient.createTodayCard()
      await loadTodayCard()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd tworzenia planszy")
      setLoading(false)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ładowanie...</p>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {error === "no_card" ? (
              <div className="text-center">
                <div className="bg-white rounded-lg shadow p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Pobierz swoją planszę Bingo na dziś!</h2>
                  <p className="text-gray-600 mb-6">
                    Kliknij poniższy przycisk, aby wygenerować swoją unikalną planszę na dzisiejszy dzień.
                  </p>
                  <button
                      onClick={createTodayCard}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg"
                  >
                    Pobierz planszę Bingo
                  </button>
                </div>
              </div>
          ) : error ? (
              <div className="text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{error}</p>
                  <button onClick={loadTodayCard} className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    Spróbuj ponownie
                  </button>
                </div>
              </div>
          ) : card ? (
              <BingoBoard card={card} onCardUpdate={silentRefresh} />
          ) : null}
        </main>
      </div>
  )
}
