export async function getNexos() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nexos`, {
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
    })
    const data = await res.json()
    return data
}

export async function createNexo(nexoData: Omit<Nexo, 'id' | 'created_at' | 'updated_at'>) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nexos`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(nexoData)
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Error al crear el nexo')
    }

    const data = await res.json()
    return data
}

export async function updateNexo(id: number, nexoData: Partial<Nexo>) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/nexos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(nexoData)
    })

    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Error al actualizar el nexo')
    }

    const data = await res.json()
    return data
}

export interface Nexo {
    id: number
    series_id: number
    users_id: number
    state: string
    seen: number
    stars: number
    created_at: string
    updated_at: string
}
