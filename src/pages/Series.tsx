import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNexos, type Nexo } from '../services/nexos'
import { getSeries, type FSerie, type Serie } from '../services/series'
import Card from '../components/Card'
import Pager from '../components/Pagination'
import './Styles/Series.css'
function Series () {
  const navigate = useNavigate()
  const [series, setSeries] = useState<Serie[]>([])
  const [nexos, setNexos] = useState<Nexo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchSerie, setSearchSerie] = useState<string>('')
  const [userID, setUserID] = useState<number>(1)
  const [page, setPage] = useState<number>(1)
  // Cargar series y nexos juntos
  useEffect(() => {
    let cancelled = false
    const stored = localStorage.getItem('id')
    if (stored) {
      setUserID(Number(stored))
    }
    async function fetchData () {
      try {
        const [seriesData, nexosData] = await Promise.all([
          getSeries(),
          getNexos()
        ])

        if (cancelled) return

        setSeries(seriesData)
        setNexos(nexosData)
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredData = useMemo(() => {
    if ((series.length === 0) || (nexos.length === 0)) return []

    const seasons: Record<string, number> = {
      Invierno: 0,
      Primavera: 1,
      Verano: 2,
      Otoño: 3
    }
    const estados: Record<string, number> = {
      'En emision': 0,
      Finalizado: 1,
      Completado: 2
    }

    // Mapa de nexos por serie para ESTE usuario
    const nexosMap = new Map<number, Nexo>()
    nexos.forEach((nexo) => {
      if (nexo.users_id === userID) {
        nexosMap.set(nexo.series_id, nexo)
      }
    })

    return series
      .filter((serie) =>
        searchSerie
          ? serie.name.toLowerCase().includes(searchSerie.toLowerCase())
          : true
      )
      .map((serie) => {
        const nexoData = nexosMap.get(serie.id)

        if (nexoData == null) return null
        // Mantengo el orden ORIGINAL: primero nexo, luego serie
        // para no romper nada de lo que espera Card/FSerie
        return { ...nexoData, ...serie } as FSerie
      })
      .filter((item): item is FSerie => item !== null)
      .sort((a, b) => {
        // 1) Orden por estado
        const estadoDiff = estados[a.state] - estados[b.state]
        if (estadoDiff !== 0) return estadoDiff

        // 2) Luego por año (desc)
        const yearDiff = b.year - a.year
        if (yearDiff !== 0) return yearDiff

        // 3) Luego por season
        return (seasons[b.season] ?? 0) - (seasons[a.season] ?? 0)
      })
  }, [series, nexos, searchSerie, userID])

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'>
      {/* Header Section */}
      <div className='relative overflow-hidden'>
        {/* Animated Background Blobs */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob' />
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000' />
        </div>

        <div className='relative z-10 pt-20 pb-12 px-6'>
          <div className='max-w-7xl mx-auto text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent'>
              Anime Database
            </h1>
            <p className='text-gray-400 text-lg mb-8'>
              Explore your personal anime database • {(filteredData.length > 0) || 0} series
            </p>

            {/* Search Bar */}
            <div className='max-w-2xl mx-auto'>
              <div className='relative group'>
                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                  <span className='text-gray-400 text-xl'>🔍</span>
                </div>
                <input
                  type='text'
                  name='Search'
                  id='Search'
                  className='w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-gray-700/50 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300'
                  placeholder='Search anime... (e.g., Shingeki no Kyojin)'
                  onChange={(e) => {
                    setSearchSerie(e.target.value)
                    setPage(1) // Reset to first page on search
                  }}
                  value={searchSerie}
                />
                {searchSerie && (
                  <button
                    onClick={() => setSearchSerie('')}
                    className='absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors'
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Series Grid */}
      <div className='max-w-7xl mx-auto px-6 pb-20'>
        {loading ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='relative w-20 h-20 mb-6'>
              <div className='absolute inset-0 border-4 border-purple-500/30 rounded-full' />
              <div className='absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin' />
            </div>
            <p className='text-gray-400 text-lg'>Loading your anime collection...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-6xl mb-4'>📺</div>
            <h3 className='text-2xl font-semibold text-white mb-2'>No anime found</h3>
            <p className='text-gray-400'>
              {searchSerie
                ? `No results for "${searchSerie}". Try a different search.`
                : 'Your collection is empty. Start adding some anime!'}
            </p>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
              {filteredData
                .slice((page - 1) * 24, (page - 1) * 24 + 24)
                .map((serie) => (
                  <Card data={serie} key={serie.id} />
                ))}
            </div>

            {/* Pagination */}
            {filteredData.length > 24 && (
              <div className='mt-12'>
                <Pager count={Math.ceil(filteredData.length / 24)} onChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={async () => await navigate('/series/add')}
        className='fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/75 hover:scale-110 transition-all duration-300 flex items-center justify-center group z-50'
        title='Añadir nueva serie'
      >
        <span className='text-white text-3xl font-bold group-hover:rotate-90 transition-transform duration-300'>
          +
        </span>
      </button>

      
    </main>
  )
}

export default Series
