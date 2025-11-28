import { useNavigate } from 'react-router-dom'
import type { FSerie } from '../services/series'

interface Props {
  data: FSerie
}

export default function Card ({ data }: Props) {
  const navigate = useNavigate()
  const handleClick = (id: number) => {
    navigate(`/series/${id}`)
  }

  // Estado color mapping
  const getStateColor = (state: string) => {
    switch (state) {
      case 'En emision':
        return {
          bg: 'bg-green-500',
          glow: 'shadow-green-500/50',
          text: 'En emisión'
        }
      case 'Finalizado':
        return {
          bg: 'bg-amber-500',
          glow: 'shadow-amber-500/50',
          text: 'Finalizado'
        }
      case 'Completado':
        return {
          bg: 'bg-blue-500',
          glow: 'shadow-blue-500/50',
          text: 'Completado'
        }
      default:
        return {
          bg: 'bg-gray-500',
          glow: 'shadow-gray-500/50',
          text: state
        }
    }
  }

  const stateInfo = getStateColor(data.state)

  return (
    <div className='group'>
      <div
        onClick={() => handleClick(data.id)}
        className='relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20'
      >
        {/* Image Container */}
        <div className='relative aspect-[2/3] overflow-hidden'>
          <img
            src={
              data.img2
                ? data.img2.includes('http')
                  ? data.img2
                  : `http://localhost:4000/Portadas/${data.img2}`
                : data.img
            }
            alt={data.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />

          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300' />

          {/* State Indicator */}
          <div className='absolute top-3 right-3 flex items-center gap-2'>
            <div
              className={`${stateInfo.bg} w-3 h-3 rounded-full ${stateInfo.glow} shadow-lg animate-pulse`}
            />
          </div>

          {/* Title Overlay - Always visible at bottom */}
          <div className='absolute bottom-0 left-0 right-0 p-4 transform translate-y-0 transition-all duration-300'>
            <h3 className='text-white font-semibold text-sm line-clamp-2 drop-shadow-lg'>
              {data.name}
            </h3>
            <p className='text-gray-300 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              {stateInfo.text}
            </p>
          </div>

          {/* Hover Info Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4'>
            <div className='transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
              <h3 className='text-white font-bold text-base mb-2 line-clamp-3'>
                {data.name}
              </h3>
              <div className='flex flex-wrap gap-2 text-xs'>
                <span className='px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white'>
                  {data.year}
                </span>
                <span className='px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white'>
                  {data.season}
                </span>
                <span className={`px-2 py-1 ${stateInfo.bg}/80 backdrop-blur-sm rounded-full text-white font-medium`}>
                  {stateInfo.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
