"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isAdmin = user && (user.role === "admin" || user.role === "super-admin")


  return (
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Bingo Game</h1>
              <nav className="ml-10 flex items-center space-x-4">
                <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Gra
                </Link>
                <Link
                    to="/ranking"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === "/ranking" ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Ranking
                </Link>
                {isAdmin && (
                    <Link
                        to="/admin"
                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                            location.pathname.startsWith("/admin")
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Panel Admina
                    </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Witaj, {user?.name}!</span>
              <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}
