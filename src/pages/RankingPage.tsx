"use client"

import type React from "react"
import { RankingTable } from "../components/RankingTable"
import { Navbar } from "../components/Navbar"

export const RankingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <RankingTable />
            </main>
        </div>
    )
}
