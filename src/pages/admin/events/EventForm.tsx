"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdminLayout } from "../../../components/AdminLayout"
import { apiClient } from "../../../lib/api"

export const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState<{
    description: string
    name: string
    image?: File
  }>({
    description: "",
    name: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
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
      const event = await apiClient.getEvent(eventId)
      setFormData({
        description: event.description,
        name: event.name,
      })

      if (event.image_url) {
        if (event.image_url.startsWith("/storage/")) {
          const baseUrl = "http://localhost:8000"
          setImagePreview(`${baseUrl}${event.image_url}`)
        } else {
          setImagePreview(event.image_url)
        }
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
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
                Nazwa *
              </label>
              <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Opis wydarzenia
              </label>
              <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={handleChange}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Obrazek wydarzenia
              </label>
              <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={handleImageChange}
              />
              <p className="text-sm text-gray-500 mt-1">
                Dozwolone formaty: JPG, JPEG, PNG, WEBP. Maksymalny rozmiar: 2MB
              </p>

              {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Podgląd obrazka:</p>
                    <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Podgląd"
                        className="h-32 w-32 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                          e.currentTarget.alt = "Błędny obrazek"
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
