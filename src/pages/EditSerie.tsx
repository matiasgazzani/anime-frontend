import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSerieById, updateSerie } from '../services/series'
import { getNexos, updateNexo, type Nexo } from '../services/nexos'
import { useAuth } from '../contexts/AuthContext'

interface SerieFormData {
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
  // Campos del nexo
  state: string
  seen: number
  stars: number
}

const SEASONS = ['Invierno', 'Primavera', 'Verano', 'Otoño']
const STATES = ['En emision', 'Finalizado', 'Completado']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)

export const EditSerie = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [nexoId, setNexoId] = useState<number | null>(null)

  const [formData, setFormData] = useState<SerieFormData>({
    name: '',
    episodes: 12,
    studio: '',
    genre: '',
    genre2: '',
    genre3: '',
    year: CURRENT_YEAR,
    season: 'Invierno',
    img: '',
    img2: '',
    splash: '',
    state: 'En emision',
    seen: 0,
    stars: 0
  })

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        // Cargar serie y nexos
        const [serieData, nexosData] = await Promise.all([
          getSerieById(id),
          getNexos()
        ])

        // Encontrar el nexo del usuario actual para esta serie
        const userId = user?.id || localStorage.getItem('id')
        const userNexo = nexosData.find(
          (n: Nexo) =>
            Number(n.series_id) === Number(id) &&
            Number(n.users_id) === Number(userId)
        )

        if (userNexo) {
          setNexoId(userNexo.id)
        }

        // Cargar datos en el formulario
        setFormData({
          name: serieData.name,
          episodes: serieData.episodes,
          studio: serieData.studio,
          genre: serieData.genre,
          genre2: serieData.genre2 || '',
          genre3: serieData.genre3 || '',
          year: serieData.year,
          season: serieData.season,
          img: serieData.img,
          img2: serieData.img2 || '',
          splash: serieData.splash || '',
          // Datos del nexo (si existe) o valores por defecto
          state: userNexo?.state || 'En emision',
          seen: userNexo?.seen || 0,
          stars: userNexo?.stars || 0
        })
      } catch (err) {
        console.error(err)
        setError('Error al cargar los datos de la serie')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const numericFields = ['episodes', 'year', 'seen', 'stars']
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setSubmitting(true)
    setError(null)

    try {
      // Separar datos de serie y nexo
      const { state, seen, stars, ...serieData } = formData

      // 1. Actualizar la serie
      await updateSerie(Number(id), serieData)

      // 2. Actualizar el nexo si existe
      if (nexoId) {
        await updateNexo(nexoId, {
          state,
          seen,
          stars
        })
      }

      setSuccess(true)
      setTimeout(() => {
        navigate(`/series/${id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center'>
        <div className='relative w-20 h-20'>
          <div className='absolute inset-0 border-4 border-purple-500/30 rounded-full' />
          <div className='absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin' />
        </div>
      </div>
    )
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4'>
      {/* Animated Background Blobs */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
      </div>

      <div className='relative z-10 max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <button
            onClick={async () => await navigate(`/series/${id}`)}
            className='inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6'
          >
            <span className='text-xl'>←</span>
            <span>Volver a Detalles</span>
          </button>
          <h1 className='text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4'>
            Editar Serie
          </h1>
          <p className='text-gray-400'>
            Actualiza la información de {formData.name}
          </p>
        </div>

        {/* Form Card */}
        <div className='bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 shadow-2xl'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Serie Name */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-semibold text-gray-300 mb-2'
              >
                Nombre de la Serie *
              </label>
              <input
                type='text'
                id='name'
                name='name'
                required
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
              />
            </div>

            {/* Studio and Episodes Row */}
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='studio'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Estudio *
                </label>
                <input
                  type='text'
                  id='studio'
                  name='studio'
                  required
                  value={formData.studio}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>

              <div>
                <label
                  htmlFor='episodes'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Episodios *
                </label>
                <input
                  type='number'
                  id='episodes'
                  name='episodes'
                  required
                  min='1'
                  max='9999'
                  value={formData.episodes}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>
            </div>

            {/* Genres */}
            <div className='grid md:grid-cols-3 gap-6'>
              <div>
                <label
                  htmlFor='genre'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Género Principal *
                </label>
                <input
                  type='text'
                  id='genre'
                  name='genre'
                  required
                  value={formData.genre}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>

              <div>
                <label
                  htmlFor='genre2'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Género Secundario
                </label>
                <input
                  type='text'
                  id='genre2'
                  name='genre2'
                  value={formData.genre2}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>

              <div>
                <label
                  htmlFor='genre3'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Género Terciario
                </label>
                <input
                  type='text'
                  id='genre3'
                  name='genre3'
                  value={formData.genre3}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>
            </div>

            {/* Year and Season */}
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='year'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Año *
                </label>
                <select
                  id='year'
                  name='year'
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                >
                  {YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor='season'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Temporada *
                </label>
                <select
                  id='season'
                  name='season'
                  required
                  value={formData.season}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                >
                  {SEASONS.map((season) => (
                    <option key={season} value={season}>
                      {season}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Images URLs */}
            <div className='space-y-4'>
              <h3 className='text-lg font-semibold text-white'>
                Imágenes (URLs)
              </h3>

              <div>
                <label
                  htmlFor='img'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Imagen Principal *
                </label>
                <input
                  type='text'
                  id='img'
                  name='img'
                  required
                  value={formData.img}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>

              <div>
                <label
                  htmlFor='img2'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Imagen Secundaria
                </label>
                <input
                  type='text'
                  id='img2'
                  name='img2'
                  value={formData.img2}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>

              <div>
                <label
                  htmlFor='splash'
                  className='block text-sm font-semibold text-gray-300 mb-2'
                >
                  Imagen de Splash
                </label>
                <input
                  type='url'
                  id='splash'
                  name='splash'
                  value={formData.splash}
                  onChange={handleChange}
                  className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                />
              </div>
            </div>

            {/* User Progress Section */}
            <div className='space-y-4 pt-4 border-t border-gray-700/50'>
              <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                <span>📊</span>
                <span>Tu Estado de Visualización</span>
              </h3>

              <div className='grid md:grid-cols-3 gap-6'>
                {/* Estado */}
                <div>
                  <label
                    htmlFor='state'
                    className='block text-sm font-semibold text-gray-300 mb-2'
                  >
                    Estado *
                  </label>
                  <select
                    id='state'
                    name='state'
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                  >
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Episodios Vistos */}
                <div>
                  <label
                    htmlFor='seen'
                    className='block text-sm font-semibold text-gray-300 mb-2'
                  >
                    Episodios Vistos *
                  </label>
                  <input
                    type='number'
                    id='seen'
                    name='seen'
                    required
                    min='0'
                    max={formData.episodes}
                    value={formData.seen}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                  />
                  <p className='text-xs text-gray-500 mt-1'>
                    Máximo: {formData.episodes}
                  </p>
                </div>

                {/* Puntuación */}
                <div>
                  <label
                    htmlFor='stars'
                    className='block text-sm font-semibold text-gray-300 mb-2'
                  >
                    Puntuación (⭐) *
                  </label>
                  <select
                    id='stars'
                    name='stars'
                    required
                    value={formData.stars}
                    onChange={handleChange}
                    className='w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all'
                  >
                    {[0, 1, 2, 3, 4, 5].map((star) => (
                      <option key={star} value={star}>
                        {star === 0 ? 'Sin puntuar' : '⭐'.repeat(star)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400'>
                <p className='flex items-center gap-2'>
                  <span className='text-xl'>⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className='p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400'>
                <p className='flex items-center gap-2'>
                  <span className='text-xl'>✅</span>
                  <span>¡Serie actualizada exitosamente! Redirigiendo...</span>
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className='flex gap-4 pt-4'>
              <button
                type='button'
                onClick={async () => await navigate(`/series/${id}`)}
                className='flex-1 px-6 py-4 bg-gray-700/50 border border-gray-600 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-all duration-300'
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={submitting || success}
                className='flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25'
              >
                {submitting
                  ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span>Guardando...</span>
                    </span>
                    )
                  : (
                      'Guardar Cambios'
                    )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}
      </style>
    </main>
  )
}
