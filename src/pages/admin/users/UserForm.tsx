"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AdminLayout } from "../../../components/AdminLayout"
import { apiClient } from "../../../lib/api"

const USER_ROLES = ["admin", "user", "super-admin"] as const
type UserRole = (typeof USER_ROLES)[number]

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user" as UserRole,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isEditMode) {
      loadUser(Number.parseInt(id))
    }
  }, [id, isEditMode])

  const loadUser = async (userId: number) => {
    setLoading(true)
    try {
      const user = await apiClient.getUser(userId)
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        password_confirmation: "",
        role: (user.role as UserRole) || "user",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd ładowania użytkownika")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateRole = (role: string): role is UserRole => {
    return USER_ROLES.includes(role as UserRole)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Walidacja roli
    if (!validateRole(formData.role)) {
      setError("Nieprawidłowa rola użytkownika. Dozwolone role to: admin, user, super-admin")
      setLoading(false)
      return
    }

    if (formData.password && formData.password !== formData.password_confirmation) {
      setError("Hasła nie są identyczne")
      setLoading(false)
      return
    }

    try {
      const userData: { name: string; email: string; role?: string; password?: string } = {
        name: formData.name,
        email: formData.email,
      }

      // Nie przesyłaj roli jeśli to super-admin
      if (formData.role !== "super-admin") {
        userData.role = formData.role
      }

      if (formData.password) {
        userData.password = formData.password
      }

      if (isEditMode) {
        await apiClient.updateUser(Number.parseInt(id), userData)
      } else {
        await apiClient.createUser(userData)
      }
      navigate("/admin/users")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd zapisywania użytkownika")
      setLoading(false)
    }
  }

  const isSuperAdmin = formData.role === "super-admin"

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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rola użytkownika *
              </label>
              {isSuperAdmin ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
                    Super Administrator
                  </div>
              ) : (
                  <select
                      id="role"
                      name="role"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={formData.role}
                      onChange={handleChange}
                  >
                    <option value="user">Użytkownik</option>
                    <option value="admin">Administrator</option>
                  </select>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {isSuperAdmin
                    ? "Rola Super Administrator nie może być zmieniona."
                    : "Wybierz rolę użytkownika. Administratorzy mają dostęp do panelu administracyjnego."}
              </p>
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
