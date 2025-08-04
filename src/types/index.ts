export interface User {
  id: number
  name: string
  email: string
  points?: number
}

export interface Event {
  id: number
  description: string
  image_url?: string
}

export interface BingoTile {
  id: number
  row: number
  col: number
  marked: boolean
  event: Event
}

export interface WinnerUser {
  id: number
  name: string
}

export interface GameStatus {
  winner_user_id: number | null
  is_finished: boolean
  is_user_winner: boolean
  winner_user: WinnerUser | null
}

export interface BingoCard {
  card_id: number
  tiles: BingoTile[]
  game_status: GameStatus
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}
