"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdminLayout } from "../../../components/AdminLayout"
import { apiClient } from "../../../lib/api"
import type { Event } from "../../../types"

export const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState<{
    description: string
    image_url: string
  }>({
    description: "",
    image_url: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isEditMode) {
      loadEvent(Number.parseInt(id))
    }
  }, [id, isEditMode])

  const loadEvent = async (eventId: number) => {
    setLoading(true)
    try {
      const event = await apiClient.getEvents().then((events) => events.find((e: Event) => e.id === eventId))

      if (event) {
        setFormData({
          description: event.description,
          image_url: event.image_url || "",
        })
      } else {
        setError("Nie znaleziono wydarzenia")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania wydarzenia")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isEditMode) {
        await apiClient.updateEvent(Number.parseInt(id), formData)
      } else {
        await apiClient.createEvent(formData)
      }
      navigate("/admin/events")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisywania wydarzenia")
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edytuj wydarzenie" : "Dodaj nowe wydarzenie"}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Opis wydarzenia *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
              URL obrazka
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Podgląd obrazka:</p>
                <img
                  src={formData.image_url || "/placeholder.svg"}
                  alt="Podgląd"
                  className="h-24 w-24 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                    e.currentTarget.alt = "Błędny URL obrazka"
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/events")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
