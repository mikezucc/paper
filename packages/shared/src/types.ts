export interface User {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}

export interface Paper {
  id: string
  userId: string
  slug: string
  title: string
  abstract: string
  content: string
  tags: string[]
  published: boolean
  font?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
}