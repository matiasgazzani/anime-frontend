import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getSeries, type Serie } from '../services/series'
import { getNexos, type Nexo } from '../services/nexos'
import ThemeToggle from '../components/ThemeToggle'

export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [series, setSeries] = useState<Serie[]>([])
  const [nexos, setNexos] = useState<Nexo[]>([])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [seriesData, nexosData] = await Promise.all([
        getSeries(),
        getNexos()
      ])
      setSeries(seriesData)
      setNexos(nexosData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const stats = useMemo(() => {
    if (!series.length || !nexos.length) return null

    const userId = Number(localStorage.getItem('id'))
    const userNexos = nexos.filter(n => n.users_id === userId)
    
    // Basic Stats
    const totalSeries = userNexos.length
    const totalEpisodes = userNexos.reduce((acc, curr) => acc + (curr.seen || 0), 0)
    const totalTimeMinutes = totalEpisodes * 24
    const totalHours = Math.floor(totalTimeMinutes / 60)
    const totalDays = (totalHours / 24).toFixed(1)
    
    // Ratings
    const ratedSeries = userNexos.filter(n => n.stars > 0)
    const averageRating = ratedSeries.length 
      ? (ratedSeries.reduce((acc, curr) => acc + curr.stars, 0) / ratedSeries.length).toFixed(1)
      : '0.0'

    // Status Distribution
    const statusCount = userNexos.reduce((acc, curr) => {
      acc[curr.state] = (acc[curr.state] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Genre Distribution (Top 5)
    const genreCount: Record<string, number> = {}
    userNexos.forEach(nexo => {
      const serie = series.find(s => s.id === nexo.series_id)
      if (serie) {
        [serie.genre, serie.genre2, serie.genre3].filter(Boolean).forEach(g => {
          genreCount[g] = (genreCount[g] || 0) + 1
        })
      }
    })
    
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    // Top 10 Rated Series
    const topRatedSeries = userNexos
      .filter(n => n.stars > 0)
      .map(n => {
        const s = series.find(ser => ser.id === n.series_id)
        return s ? { ...s, rating: n.stars } : null
      })
      .filter((item): item is (Serie & { rating: number }) => item !== null)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)

    // Series by Year
    const yearCount: Record<number, number> = {}
    userNexos.forEach(n => {
      const s = series.find(ser => ser.id === n.series_id)
      // Asegurar que el año sea un número válido
      if (s) {
        const year = Number(s.year)
        if (!isNaN(year) && year > 1900 && year < 2100) {
          yearCount[year] = (yearCount[year] || 0) + 1
        }
      }
    })
    const seriesByYear = Object.entries(yearCount)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => b.year - a.year) // Newest first

    // Top Studios
    const studioCount: Record<string, number> = {}
    userNexos.forEach(n => {
      const s = series.find(ser => ser.id === n.series_id)
      if (s && s.studio) {
        studioCount[s.studio] = (studioCount[s.studio] || 0) + 1
      }
    })
    const topStudios = Object.entries(studioCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      totalSeries,
      totalEpisodes,
      totalHours,
      totalDays,
      averageRating,
      statusCount,
      topGenres,
      topRatedSeries,
      seriesByYear,
      topStudios
    }
  }, [series, nexos])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 flex items-center justify-center'>
        <ThemeToggle />
        <div className='flex flex-col items-center'>
          <div className='w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4' />
          <p className='text-gray-600 dark:text-gray-400'>Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <main className='h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 transition-colors duration-300 overflow-hidden flex flex-col p-4 md:p-6'>
      <ThemeToggle />
      
      {/* Animated Background */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-20 animate-blob' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-20 animate-blob animation-delay-2000' />
      </div>

      {/* Header - Compact */}
      <div className='relative z-10 flex justify-between items-center mb-4 shrink-0'>
        <div>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent'>
            Panel de Control
          </h1>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Hola, <span className='font-semibold text-purple-600 dark:text-purple-400'>{user?.name || localStorage.getItem('name')}</span>
          </p>
        </div>
        
        <div className='flex gap-3'>
          <button
            onClick={() => navigate('/series')}
            className='px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 transition-all text-sm'
          >
            📺 Ver Colección
          </button>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 text-red-500 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm'
          >
            Salir
          </button>
        </div>
      </div>

      {/* Stats Row - Compact */}
      <div className='relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 shrink-0'>
        {[
          { icon: '📚', label: 'Total', value: stats?.totalSeries || 0, sub: 'Series', color: 'purple' },
          { icon: '🎬', label: 'Vistos', value: stats?.totalEpisodes || 0, sub: 'Episodios', color: 'blue' },
          { icon: '⏱️', label: 'Tiempo', value: stats?.totalDays || 0, sub: 'Días', color: 'pink' },
          { icon: '⭐', label: 'Media', value: stats?.averageRating || 0, sub: 'Rating', color: 'yellow' }
        ].map((stat, i) => (
          <div key={i} className='bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 p-3 rounded-xl shadow-sm flex items-center gap-3'>
            <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg text-${stat.color}-600 dark:text-${stat.color}-400 text-xl`}>
              {stat.icon}
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white leading-none'>{stat.value}</h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid - Fills remaining height */}
      <div className='relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 min-h-0'>
        
        {/* Left Col: Top 10 (Scrollable) */}
        <div className='md:col-span-3 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm flex flex-col overflow-hidden'>
          <div className='p-4 border-b border-gray-200 dark:border-gray-700/50 shrink-0'>
            <h3 className='font-bold text-gray-900 dark:text-white flex items-center gap-2'>
              🏆 Top 10
            </h3>
          </div>
          <div className='p-4 overflow-y-auto flex-1 space-y-3 custom-scrollbar'>
            {stats?.topRatedSeries.map((serie, index) => (
              <div key={serie.id} className='flex items-center gap-3 group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors' onClick={() => navigate(`/series/${serie.id}`)}>
                <span className={`font-bold w-4 text-sm ${index < 3 ? 'text-yellow-500' : 'text-gray-400'}`}>#{index + 1}</span>
                <img 
                  src={serie.img2?.includes('http') ? serie.img2 : `${import.meta.env.VITE_API_URL}/api/Portadas/${serie.img2}`} 
                  alt={serie.name}
                  className='w-10 h-14 rounded object-cover bg-gray-200'
                />
                <div className='flex-1 min-w-0'>
                  <h4 className='text-xs font-semibold text-gray-900 dark:text-white truncate group-hover:text-purple-500'>{serie.name}</h4>
                  <div className='flex items-center gap-1 text-yellow-500 text-xs'>
                    <span>⭐</span>
                    <span>{serie.rating}</span>
                  </div>
                </div>
              </div>
            ))}
             {(!stats?.topRatedSeries || stats.topRatedSeries.length === 0) && (
              <p className='text-center text-gray-500 text-xs py-4'>Sin calificaciones</p>
            )}
          </div>
        </div>

        {/* Middle Col: Year Chart & Status */}
        <div className='md:col-span-6 flex flex-col gap-4 min-h-0'>
          {/* Year Chart */}
          <div className='flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-4 flex flex-col min-h-0'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-2 shrink-0 text-sm'>📅 Series por Año</h3>
            <div className='flex-1 flex items-end gap-1 overflow-x-auto pb-1 min-h-0'>
              {stats?.seriesByYear.map((item) => (
                <div key={item.year} className='flex flex-col items-center gap-1 group min-w-[30px] h-full justify-end'>
                  <div className='relative w-full flex-1 flex items-end justify-center'>
                    <div 
                      className='w-full bg-blue-500/50 group-hover:bg-blue-500 rounded-t transition-all duration-300 relative'
                      style={{ height: `${(item.count / Math.max(...stats.seriesByYear.map(i => i.count))) * 100}%` }}
                    >
                      <div className='opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none transition-opacity whitespace-nowrap z-10'>
                        {item.count}
                      </div>
                    </div>
                  </div>
                  <span className='text-[10px] text-gray-500 rotate-90 origin-left translate-y-2 translate-x-1'>{item.year}</span>
                </div>
              ))}
              {(!stats?.seriesByYear || stats.seriesByYear.length === 0) && (
                <div className='w-full h-full flex items-center justify-center text-gray-500 text-xs'>
                  No hay datos de años
                </div>
              )}
            </div>
          </div>

          {/* Status Distribution */}
          <div className='h-1/3 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-4 overflow-y-auto'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-3 text-sm'>📊 Estado</h3>
            <div className='space-y-2'>
              {Object.entries(stats?.statusCount || {}).map(([status, count]) => (
                <div key={status} className='flex items-center gap-2 text-xs'>
                  <span className='w-20 truncate text-gray-600 dark:text-gray-400'>{status}</span>
                  <div className='flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5'>
                    <div 
                      className={`h-1.5 rounded-full ${
                        status === 'Completado' ? 'bg-blue-500' :
                        status === 'En emision' ? 'bg-green-500' :
                        status === 'Finalizado' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${(count / (stats?.totalSeries || 1)) * 100}%` }}
                    />
                  </div>
                  <span className='w-8 text-right text-gray-500'>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Genres & Studios */}
        <div className='md:col-span-3 flex flex-col gap-4 min-h-0'>
          {/* Genres */}
          <div className='flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-4 overflow-y-auto'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-3 text-sm'>🎭 Géneros Top</h3>
            <div className='space-y-3'>
              {stats?.topGenres.map(([genre, count], index) => (
                <div key={genre} className='flex items-center gap-2 text-xs'>
                  <span className='font-bold text-gray-400 w-3'>#{index + 1}</span>
                  <div className='flex-1'>
                    <div className='flex justify-between mb-0.5'>
                      <span className='text-gray-700 dark:text-gray-300 truncate'>{genre}</span>
                      <span className='text-gray-500'>{count}</span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1'>
                      <div 
                        className='bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full'
                        style={{ width: `${(count / (stats?.topGenres[0][1] || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Studios */}
          <div className='flex-1 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700/50 rounded-2xl shadow-sm p-4 overflow-y-auto'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-3 text-sm'>🏢 Estudios Top</h3>
            <div className='space-y-3'>
              {stats?.topStudios.map(([studio, count], index) => (
                <div key={studio} className='flex items-center gap-2 text-xs'>
                  <span className='font-bold text-purple-500 w-3'>#{index + 1}</span>
                  <div className='flex-1'>
                    <div className='flex justify-between mb-0.5'>
                      <span className='text-gray-700 dark:text-gray-300 truncate'>{studio}</span>
                      <span className='text-gray-500'>{count}</span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1'>
                      <div 
                        className='bg-gradient-to-r from-blue-500 to-cyan-500 h-1 rounded-full'
                        style={{ width: `${(count / (stats?.topStudios[0][1] || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
