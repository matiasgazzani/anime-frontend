import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import VideoModal from '../components/VideoModal'
import ThemeToggle from '../components/ThemeToggle'
import { getSerieById, getSerieByName, type FSerie } from '../services/series'
import { getNexos, type Nexo } from '../services/nexos'

const SeriePage = () => {
  const { id } = useParams<{ id: string }>()

  const [serie, setSerie] = useState<FSerie | null>(null)
  const [nexos, setNexos] = useState<Nexo[] | null>(null)
  const [synopsis, setSynopsis] = useState<string | null>(null)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [malId, setMalId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar serie y nexos en paralelo
        const [serieData, nexosData] = await Promise.all([
          getSerieById(id),
          getNexos()
        ])

        setSerie(serieData)
        setNexos(nexosData)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar la información de la serie.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Filtrar el nexo específico para este usuario y esta serie
  const filteredNexo = useMemo(() => {
    if ((nexos == null) || !id) return null
    const userId = localStorage.getItem('id')
    if (!userId) return null

    return nexos.find(
      (nexo: Nexo) =>
        Number(nexo.series_id) === Number(id) &&
        Number(nexo.users_id) === Number(userId)
    )
  }, [nexos, id])

  useEffect(() => {
    if (!serie?.name) return

    const controller = new AbortController()

    const fetchAnimeAPI = async () => {
      try {
        const data = await getSerieByName(serie.name)
        const first = data?.data?.[0]
        if (first?.synopsis) {
          setSynopsis(first.synopsis)
        }
        // Guardar el MAL ID para obtener videos
        if (first?.mal_id) {
          setMalId(first.mal_id)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchAnimeAPI()

    return () => controller.abort()
  }, [serie?.name])

  // Obtener videos cuando tengamos el MAL ID
  useEffect(() => {
    if (!malId) return

    const fetchVideos = async () => {
      try {
        // const videosData = await getAnimeVideos(malId);
        const videosData = await getSerieByName(serie?.name ?? '')
        if (videosData?.data) {
          // Intentar obtener video de diferentes fuentes en orden de prioridad
          let videoUrl = null
          // 1. Intentar con promos
          if (videosData.data[0].trailer) {
            videoUrl = videosData.data[0].trailer.embed_url
            videoUrl = videoUrl.replace('-nocookie', '')
          }

          /* // 2. Si no hay promo, intentar con episodes
          if (!videoUrl && videosData.data.episodes && videosData.data.episodes.length > 0) {
            videoUrl = videosData.data.episodes[0].url;
          }

          // 3. Si no hay episodes, intentar con music videos
          if (!videoUrl && videosData.data.music_videos && videosData.data.music_videos.length > 0) {
            videoUrl = videosData.data.music_videos[0].video?.url;
          } */

          if (videoUrl) {
            setTrailerUrl(videoUrl)
          }
        }
      } catch (err) {
        console.error('Error fetching videos:', err)
      }
    }

    fetchVideos()
  }, [malId])

  // Mientras carga
  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center'>
        <ThemeToggle />
        <div className='text-center'>
          <div className='relative w-20 h-20 mb-6 mx-auto'>
            <div className='absolute inset-0 border-4 border-purple-500/30 rounded-full' />
            <div className='absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin' />
          </div>
          <p className='text-gray-600 dark:text-gray-400 text-lg'>Cargando información del anime...</p>
        </div>
      </div>
    )
  }

  // Si hay error o no hay datos
  if (error || (serie == null)) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center'>
        <ThemeToggle />
        <div className='text-center'>
          <div className='text-6xl mb-4'>😞</div>
          <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-2'>Anime no encontrado</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6'>{error ?? 'No se encontró la serie.'}</p>
          <button
            onClick={async () => await navigate('/series')}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105'
          >
            ← Volver a la colección
          </button>
        </div>
      </div>
    )
  }

  // Estado color mapping
  const getStateInfo = (state: string) => {
    switch (state) {
      case 'En emision':
        return { color: 'bg-green-500', text: 'En emisión', icon: '📡' }
      case 'Finalizado':
        return { color: 'bg-amber-500', text: 'Finalizado', icon: '✓' }
      case 'Completado':
        return { color: 'bg-blue-500', text: 'Completado', icon: '★' }
      default:
        return { color: 'bg-gray-500', text: state, icon: '•' }
    }
  }

  const stateInfo = getStateInfo(filteredNexo?.state || '')
  const imageUrl = serie.img2
    ? serie.img2.includes('http')
      ? serie.img2
      : `${import.meta.env.VITE_API_URL}/api/Portadas/${serie.img2}`
    : serie.img

  const genres = [serie.genre, serie.genre2, serie.genre3].filter(Boolean)

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900'>
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Back Button */}
      <button
        onClick={async () => await navigate('/series')}
        className='fixed top-24 left-6 z-50 p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/80 hover:border-purple-500/50 transition-all duration-300 hover:scale-110 group'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
      </button>

      {/* Hero Section with Background Image */}
      <div className='relative h-[70vh] overflow-hidden'>
        {/* Background Image with Overlay */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${imageUrl})`
          }}
        >
          <div className='absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 dark:to-transparent' />
          <div className='absolute inset-0 bg-gradient-to-r from-gray-50 via-transparent to-gray-50/50 dark:from-gray-900 dark:via-transparent dark:to-gray-900/50' />
        </div>

        {/* Hero Content */}
        <div className='relative z-10 h-full flex items-end'>
          <div className='max-w-7xl mx-auto px-6 pb-12 w-full'>
            <div className='flex flex-col md:flex-row gap-8 items-end'>
              {/* Poster */}
              <div className='flex-shrink-0'>
                <img
                  src={imageUrl}
                  alt={serie.name}
                  className='w-48 md:w-64 rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700/50'
                />
              </div>

              {/* Info */}
              <div className='flex-1 pb-4'>
                <h1 className='text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg'>
                  {serie.name}
                </h1>

                {/* Meta Info */}
                <div className='flex flex-wrap gap-3 mb-6'>
                  <span className={`px-4 py-2 ${stateInfo.color} rounded-full text-white font-semibold flex items-center gap-2`}>
                    <span>{stateInfo.icon}</span>
                    {stateInfo.text}
                  </span>
                  <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold'>
                    {serie.year}
                  </span>
                  <span className='px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold'>
                    {serie.season}
                  </span>
                  {filteredNexo?.stars && (
                    <span className='px-4 py-2 bg-yellow-500/80 backdrop-blur-sm rounded-full text-white font-semibold flex items-center gap-1'>
                      ⭐ {filteredNexo.stars}/5
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-wrap gap-4'>
                  <Modal
                    title={serie.name}
                    data={
                      synopsis ??
                      'Sinopsis no disponible por el momento. Estamos trabajando para conseguir más información sobre este anime.'
                    }
                    button='📖 Ver Sinopsis'
                  />
                  {trailerUrl
                    ? (
                      <VideoModal videoUrl={trailerUrl} title={`${serie.name} - Trailer`} />
                      )
                    : (
                      <button
                        disabled
                        className='px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-gray-500 font-semibold cursor-not-allowed'
                        title='Trailer no disponible'
                      >
                        ▶️ Trailer no disponible
                      </button>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          {/* Main Info Card */}
          <div className='md:col-span-2 space-y-8'>
            {/* Stats Grid */}
            <div className='bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2'>
                📊 Estadísticas
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <div className='bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 text-center'>
                  <div className='text-3xl mb-2'>📺</div>
                  <div className='text-2xl font-bold text-purple-400'>{filteredNexo?.seen || 0}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Episodios vistos</div>
                </div>
                <div className='bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 text-center'>
                  <div className='text-3xl mb-2'>⭐</div>
                  <div className='text-2xl font-bold text-yellow-400'>{filteredNexo?.stars || 'N/A'}/5</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Calificación</div>
                </div>
                <div className='bg-gray-100 dark:bg-gray-900/50 rounded-xl p-4 text-center'>
                  <div className='text-3xl mb-2'>📅</div>
                  <div className='text-2xl font-bold text-blue-400'>{serie.year}</div>
                  <div className='text-gray-600 dark:text-gray-400 text-sm'>Año</div>
                </div>
              </div>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className='bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                  🎭 Géneros
                </h2>
                <div className='flex flex-wrap gap-3'>
                  {genres.map((genre, index) => (
                    <span
                      key={index}
                      className='px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl text-purple-300 font-semibold'
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className='space-y-6'>
            <div className='bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl p-6'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>Información</h2>
              <div className='space-y-3 text-sm'>
                {serie.studio && (
                  <div>
                    <div className='text-gray-600 dark:text-gray-400 mb-1'>Estudio</div>
                    <div className='text-gray-900 dark:text-white font-semibold'>{serie.studio}</div>
                  </div>
                )}
                <div>
                  <div className='text-gray-600 dark:text-gray-400 mb-1'>Estado</div>
                  <div className='text-gray-900 dark:text-white font-semibold flex items-center gap-2'>
                    <span className={`w-2 h-2 ${stateInfo.color} rounded-full`} />
                    {stateInfo.text}
                  </div>
                </div>
                <div>
                  <div className='text-gray-600 dark:text-gray-400 mb-1'>Temporada</div>
                  <div className='text-gray-900 dark:text-white font-semibold'>{serie.season} {serie.year}</div>
                </div>
                {(filteredNexo != null) && (
                  <div>
                    <div className='text-gray-600 dark:text-gray-400 mb-1'>Progreso</div>
                    <div className='text-gray-900 dark:text-white font-semibold'>{filteredNexo.seen} episodios vistos</div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className='bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6'>
              <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4'>Acciones rápidas</h3>
              <div className='space-y-3'>
                <button
                  onClick={async () => await navigate(`/series/edit/${id}`)}
                  className='w-full px-4 py-3 bg-purple-600/50 hover:bg-purple-600/70 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105'
                >
                  ✏️ Editar información
                </button>
                <button className='w-full px-4 py-3 bg-blue-600/50 hover:bg-blue-600/70 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105'>
                  ➕ Agregar a lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeriePage
