const API_BASE_URL = "http://localhost:8000/api"

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Logout failed")
    }

    return response.json()
  }

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to get user info")
    }

    return response.json()
  }

  async getTodayCard() {
    const response = await fetch(`${API_BASE_URL}/bingo/today`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to get bingo card")
    }

    return response.json()
  }

  async createTodayCard() {
    const response = await fetch(`${API_BASE_URL}/bingo/create`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create bingo card")
    }

    return response.json()
  }

  async markTile(tileId: number) {
    const response = await fetch(`${API_BASE_URL}/bingo/mark`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ tile_id: tileId }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to mark tile")
    }

    return response.json()
  }

  async claimWin() {
    const response = await fetch(`${API_BASE_URL}/bingo/claim-win`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to claim win")
    }

    return response.json()
  }

  async hasBingo() {
    const response = await fetch(`${API_BASE_URL}/bingo/has-bingo`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to check bingo status")
    }

    return response.json()
  }

  async getRanking(type = "all_time", limit = 10) {
    const response = await fetch(`${API_BASE_URL}/ranking?type=${type}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to get ranking")
    }

    return response.json()
  }

  // Nowe metody dla eventów
  async getEvents() {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to get events")
    }

    return response.json()
  }

  async createEvent(data: { description: string; image_url?: string }) {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create event")
    }

    return response.json()
  }

  async updateEvent(id: number, data: { description?: string; image_url?: string }) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update event")
    }

    return response.json()
  }

  async deleteEvent(id: number) {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to delete event")
    }

    return response.json()
  }

  // Metody dla użytkowników
  async createUser(data: { name: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create user")
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
