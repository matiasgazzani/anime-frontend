import { useState } from 'react'

interface Props {
  videoUrl: string
  title: string
}

function VideoModal ({ videoUrl, title }: Props) {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  // Verificar si es un video de YouTube
  const isYouTube = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  // Extraer el ID del video de YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes('v=')) {
        return `https://www.youtube.com/embed/${url.split('v=')[1].split('&')[0]}`
      } else if (url.includes('youtu.be/')) {
        return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`
      }
      return url
    } catch (e) {
      return url
    }
  }

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        className='px-6 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white font-semibold hover:bg-gray-700/80 hover:border-purple-500/50 transition-all duration-300'
        onClick={handleOpen}
      >
        ▶️ Reproducir
      </button>

      {/* Modal */}
      {open && (
        <div
          className='fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4'
          onClick={handleClose}
        >
          <div
            className='bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-3xl shadow-2xl max-w-5xl w-full animate-scaleIn overflow-hidden'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='p-6 border-b border-gray-700/50 flex justify-between items-center'>
              <h2 className='text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                {title}
              </h2>
              <button
                onClick={handleClose}
                className='p-2 hover:bg-gray-800 rounded-full transition-colors duration-300'
              >
                <svg
                  className='w-6 h-6 text-gray-400 hover:text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className='relative w-full bg-black flex items-center justify-center' style={{ minHeight: '400px', paddingBottom: isYouTube(videoUrl) ? '56.25%' : '0' }}>
              {isYouTube(videoUrl)
                ? (
                  <iframe
                    className='absolute top-0 left-0 w-full h-full'
                    src={getYouTubeEmbedUrl(videoUrl)}
                    title={title}
                    frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                  )
                : (
                  <div className='flex flex-col items-center justify-center p-12 text-center'>
                    <div className='text-6xl mb-6'>📺</div>
                    <h3 className='text-2xl font-bold text-white mb-4'>Video externo disponible</h3>
                    <p className='text-gray-400 mb-8 max-w-md'>
                      Este video no se puede reproducir directamente aquí. Puedes verlo en la página oficial.
                    </p>
                    <a
                      href={videoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2'
                    >
                      Ver Video Externo ↗
                    </a>
                  </div>
                  )}
            </div>

            {/* Footer */}
            <div className='p-4 border-t border-gray-700/50 flex justify-end'>
              <button
                className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105'
                onClick={handleClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}
      </style>
    </>
  )
}

export default VideoModal
