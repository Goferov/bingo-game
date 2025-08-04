"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AdminLayout } from "../../components/AdminLayout"
import { apiClient } from "../../lib/api"

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    eventsCount: 0,
    usersCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      try {
        // W rzeczywistej aplikacji pobieralibyśmy te dane z API
        // Tutaj symulujemy pobieranie danych
        const events = await apiClient.getEvents()
        setStats({
          eventsCount: events.length,
          usersCount: 0, // Brak endpointu do pobierania wszystkich użytkowników
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Liczba wydarzeń</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.eventsCount}</dd>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="/admin/events" className="font-medium text-blue-600 hover:text-blue-500">
                  Zarządzaj wydarzeniami
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Liczba użytkowników</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.usersCount}</dd>
              </dl>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="/admin/users" className="font-medium text-blue-600 hover:text-blue-500">
                  Zarządzaj użytkownikami
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
