"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { apiClient } from "../lib/api"

interface RankingUser {
  id: number
  name: string
  points?: number
  wins?: number
}

interface RankingData {
  type: string
  users: RankingUser[]
}

export const RankingTable: React.FC = () => {
  const [rankingType, setRankingType] = useState<string>("all_time")
  const [rankingData, setRankingData] = useState<RankingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRanking(rankingType)
  }, [rankingType])

  const loadRanking = async (type: string) => {
    setLoading(true)
    setError("")

    try {
      const data = await apiClient.getRanking(type)
      setRankingData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania rankingu")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button onClick={() => loadRanking(rankingType)} className="mt-2 text-sm underline">
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Ranking graczy</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setRankingType("all_time")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              rankingType === "all_time" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Wszech czasów
          </button>
          <button
            onClick={() => setRankingType("monthly")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              rankingType === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Miesięczny
          </button>
          <button
            onClick={() => setRankingType("weekly")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              rankingType === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tygodniowy
          </button>
          <button
            onClick={() => setRankingType("daily")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              rankingType === "daily" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dzienny
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pozycja
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gracz</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {rankingType === "all_time" ? "Punkty" : "Wygrane"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rankingData?.users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-semibold">
                    {rankingType === "all_time" ? user.points : user.wins}
                  </div>
                </td>
              </tr>
            ))}

            {rankingData?.users.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                  Brak danych do wyświetlenia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
