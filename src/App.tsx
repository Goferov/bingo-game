import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { LoginPage } from "./pages/LoginPage"
import { GamePage } from "./pages/GamePage"
import { RankingPage } from "./pages/RankingPage"
import { AdminDashboard } from "./pages/admin/AdminDashboard"
import { EventsList } from "./pages/admin/events/EventsList"
import { EventForm } from "./pages/admin/events/EventForm"
import { UsersList } from "./pages/admin/users/UsersList"
import { UserForm } from "./pages/admin/users/UserForm"

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />

                        {/* Chronione trasy dla zalogowanych użytkowników */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <GamePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/ranking"
                            element={
                                <ProtectedRoute>
                                    <RankingPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Panel administratora */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events"
                            element={
                                <ProtectedRoute>
                                    <EventsList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events/create"
                            element={
                                <ProtectedRoute>
                                    <EventForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/events/edit/:id"
                            element={
                                <ProtectedRoute>
                                    <EventForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute>
                                    <UsersList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users/create"
                            element={
                                <ProtectedRoute>
                                    <UserForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users/edit/:id"
                            element={
                                <ProtectedRoute>
                                    <UserForm />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
