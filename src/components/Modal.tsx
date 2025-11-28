import { useState } from 'react'

interface Props {
  data: string
  title: string
  button: string
}

function Modal ({ data, title, button }: Props) {
  const [open, setOpen] = useState(false)

  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        className='px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105'
        onClick={handleOpen}
      >
        {button}
      </button>

      {/* Modal */}
      {open && (
        <div
          className='fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn'
          onClick={handleClose}
        >
          <div
            className='bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 shadow-2xl max-w-2xl mx-4 animate-scaleIn'
            onClick={(e) => e.stopPropagation()} // evita que cierre al clickear dentro
          >
            <h1 className='text-3xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
              {title}
            </h1>
            <div className='max-h-96 overflow-y-auto mb-6 pr-2 custom-scrollbar'>
              <p className='text-gray-300 leading-relaxed'>{data}</p>
            </div>

            <div className='flex justify-end'>
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

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #a855f7 0%, #f472b6 100%);
        }
      `}
      </style>
    </>
  )
}

export default Modal
