import axios, { AxiosError } from "axios"

export type User = {
  id: string
  email: string
  created_at: string
}

export type PosterStatus = "processing" | "completed" | "failed"

export type Poster = {
  id: string
  user_id: string
  brand_name: string
  product_name: string
  product_description: string
  price: string
  status: PosterStatus
  image_path: string | null
  created_at: string
  updated_at: string
}

// global error response shape from the BE
type ApiErrorResponse = {
  message?: string
}

export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  confirmPassword: string
}

export type CreatePosterInput = {
  brand_name: string
  product_name: string
  product_description: string
  price: string
}

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // include cookies
  headers: {
    "Content-Type": "application/json",
  },
})

// helper function for turning failed Axios requests into readable UI messages
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined
    return data?.message ?? fallback
  }

  return fallback
}

export async function login(input: LoginInput) {
  const response = await api.post<{ user: User }>("/auth/login", input)

  return response.data.user
}

export async function register(input: RegisterInput) {
  const response = await api.post<{ user: User }>("/auth/register", input)

  return response.data.user
}

export async function logout() {
  await api.post("/auth/logout")
}

export async function getCurrentUser() {
  const response = await api.get<{ user: User }>("/auth/me")

  return response.data.user
}

export async function getPosters() {
  const response = await api.get<{ posters: Poster[] }>("/posters")

  return response.data.posters
}

export async function createPoster(input: CreatePosterInput) {
  const response = await api.post<{ poster: Poster }>("/posters", input)

  return response.data.poster
}

export async function getPoster(id: string) {
  const response = await api.get<{ poster: Poster }>(`/posters/${id}`)

  return response.data.poster
}
