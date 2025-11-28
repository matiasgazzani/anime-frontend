const BASE_URL = 'http://localhost:4000/api/'

export async function getSeries() {
  const res = await fetch(`${BASE_URL}series`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  })
  const data = await res.json()
  return data
}

export async function getSerieById(id: string) {
  const res = await fetch(`http://localhost:4000/api/series/${id}`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
  })
  const data = await res.json()
  return data
}

export async function createSerie(serieData: Omit<Serie, 'id' | 'status' | 'created_at' | 'updated_at'>) {
  const res = await fetch(`${BASE_URL}series`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify(serieData)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Error al crear la serie')
  }

  const data = await res.json()
  return data
}

export async function updateSerie(id: number, serieData: Partial<Serie>) {
  const res = await fetch(`${BASE_URL}series/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    },
    body: JSON.stringify({ ...serieData, status: 1 })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Error al actualizar la serie')
  }

  const data = await res.json()
  return data
}

export async function getSerieByName(name: string) {
  const controller = new AbortController()
  const res = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
      name
    )}&type=tv&limit=1`,
    { signal: controller.signal }
  )

  if (!res.ok) return

  const data = await res.json()
  return data
}

export interface Serie {
  id: number
  name: string
  episodes: number
  studio: string
  genre: string
  genre2: string
  genre3: string
  year: number
  season: string
  img: string
  img2: string
  splash: string
  status: number
  created_at: string
  updated_at: string
}

export interface FSerie {
  id: number
  name: string
  episodes: number
  studio: string
  genre: string
  genre2: string
  genre3: string
  year: number
  season: string
  img: string
  img2: string
  splash: string
  status: number
  created_at: string
  updated_at: string
  series_id: number
  users_id: number
  state: string
  seen: number
  stars: number
}
