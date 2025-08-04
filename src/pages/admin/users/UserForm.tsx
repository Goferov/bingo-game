"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdminLayout } from "../../../components/AdminLayout"
import { apiClient } from "../../../lib/api"

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isEditMode) {
      // W rzeczywistej aplikacji pobieralibyśmy dane użytkownika z API
      // Tutaj symulujemy pobieranie danych
      setLoading(true)
      setTimeout(() => {
        if (id === "1") {
          setFormData({
            name: "Admin",
            email: "admin@example.com",
            password: "",
            password_confirmation: "",
          })
        } else if (id === "2") {
          setFormData({
            name: "User 1",
            email: "user1@example.com",
            password: "",
            password_confirmation: "",
          })
        } else {
          setError("Nie znaleziono użytkownika")
        }
        setLoading(false)
      }, 500)
    }
  }, [id, isEditMode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (formData.password !== formData.password_confirmation) {
      setError("Hasła nie są identyczne")
      setLoading(false)
      return
    }

    try {
      if (isEditMode) {
        // W rzeczywistej aplikacji wysyłalibyśmy dane do API
        // Tutaj symulujemy zapisywanie
        setTimeout(() => {
          navigate("/admin/users")
        }, 500)
      } else {
        await apiClient.createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
        navigate("/admin/users")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisywania użytkownika")
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditMode ? "Edytuj użytkownika" : "Dodaj nowego użytkownika"}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa użytkownika *
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło {isEditMode ? "(pozostaw puste, aby nie zmieniać)" : "*"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Potwierdzenie hasła {isEditMode ? "(pozostaw puste, aby nie zmieniać)" : "*"}
            </label>
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              required={!isEditMode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.password_confirmation}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
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
