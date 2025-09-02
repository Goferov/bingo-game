"use client"

import type React from "react"
import type { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Navigate, Link, useLocation } from "react-router-dom"

interface AdminLayoutProps {
  children: ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Debugowanie
  // console.log("AdminLayout - user:", user)
  // console.log("AdminLayout - user.id:", user?.id)
  // console.log("AdminLayout - typeof user.id:", typeof user?.id)

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
    )
  }

  const isAdmin = user && (user.id === 1 || user.id === "1")

  if (!isAdmin) {
    console.log("Not admin, redirecting to /")
    return <Navigate to="/" replace />
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl font-bold">Panel Administratora</span>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                        to="/admin"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            location.pathname === "/admin"
                                ? "bg-blue-900 text-white"
                                : "text-gray-300 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                        to="/admin/events"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            location.pathname.startsWith("/admin/events")
                                ? "bg-blue-900 text-white"
                                : "text-gray-300 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      Wydarzenia
                    </Link>
                    <Link
                        to="/admin/users"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            location.pathname.startsWith("/admin/users")
                                ? "bg-blue-900 text-white"
                                : "text-gray-300 hover:bg-blue-700 hover:text-white"
                        }`}
                    >
                      Użytkownicy
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Link
                    to="/"
                    className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Powrót do gry
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>
  )
}
