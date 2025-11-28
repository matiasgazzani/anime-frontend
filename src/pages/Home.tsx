import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export const Home = () => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const featuredAnimes = [
    {
      id: 1,
      title: 'Attack on Titan',
      genre: 'Action, Dark Fantasy',
      rating: 9.0,
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 2,
      title: 'Demon Slayer',
      genre: 'Action, Supernatural',
      rating: 8.7,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 3,
      title: 'My Hero Academia',
      genre: 'Action, Superhero',
      rating: 8.4,
      gradient: 'from-green-500 to-teal-600'
    },
    {
      id: 4,
      title: 'Jujutsu Kaisen',
      genre: 'Action, Supernatural',
      rating: 8.6,
      gradient: 'from-blue-500 to-indigo-600'
    }
  ]

  const stats = [
    { label: 'Total Anime', value: '10,000+', icon: '📺' },
    { label: 'Active Users', value: '50,000+', icon: '👥' },
    { label: 'Reviews', value: '100,000+', icon: '⭐' },
    { label: 'Genres', value: '50+', icon: '🎭' }
  ]

  const features = [
    {
      icon: '🔍',
      title: 'Advanced Search',
      description: 'Find your favorite anime with powerful filters and search capabilities'
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Keep track of episodes watched and manage your watchlist effortlessly'
    },
    {
      icon: '⭐',
      title: 'Rate & Review',
      description: 'Share your thoughts and discover what others think about each series'
    },
    {
      icon: '🎯',
      title: 'Personalized',
      description: 'Get recommendations based on your viewing history and preferences'
    }
  ]

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob' />
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000' />
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000' />
        </div>

        <div
          className={`relative z-10 text-center px-6 transition-all duration-1000 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className='text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient'>
            Anime Database
          </h1>
          <p className='text-xl md:text-2xl text-gray-300 mb-4 max-w-2xl mx-auto'>
            Your Ultimate Anime Companion
          </p>
          <p className='text-lg text-gray-400 mb-12 max-w-xl mx-auto'>
            Discover, track, and explore thousands of anime series. All your favorite shows in one beautiful place.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <button
              onClick={async () => await navigate('/series')}
              className='group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 overflow-hidden'
            >
              <span className='relative z-10'>Explore Collection</span>
              <div className='absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
            </button>
            <button
              onClick={async () => await navigate('/series')}
              className='px-8 py-4 bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/50 rounded-full text-white font-semibold text-lg hover:bg-gray-800/70 hover:border-purple-400 transition-all duration-300 hover:scale-105'
            >
              Browse Genres
            </button>
          </div>

          {/* Scroll Indicator */}
          {/* <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 px-6 bg-black/30 backdrop-blur-sm'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div
                key={index}
                className='text-center transform hover:scale-110 transition-transform duration-300'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='text-5xl mb-3'>{stat.icon}</div>
                <div className='text-3xl md:text-4xl font-bold text-white mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-400 text-sm md:text-base'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4 text-white'>
            Why Choose Anime DB?
          </h2>
          <p className='text-gray-400 text-center mb-16 max-w-2xl mx-auto'>
            Everything you need to manage and discover your anime journey
          </p>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='group p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20'
              >
                <div className='text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-semibold text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-400 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Anime Section */}
      <section className='py-20 px-6 bg-black/30 backdrop-blur-sm'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4 text-white'>
            Featured Anime
          </h2>
          <p className='text-gray-400 text-center mb-16'>
            Popular series trending right now
          </p>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {featuredAnimes.map((anime, index) => (
              <div
                key={anime.id}
                className='group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl cursor-pointer'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`h-64 bg-gradient-to-br ${anime.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className='absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300' />
                  <div className='relative z-10 text-white text-6xl opacity-50 group-hover:opacity-70 transition-opacity duration-300'>
                    📺
                  </div>
                  <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-yellow-400 font-semibold flex items-center gap-1'>
                    <span>⭐</span>
                    <span>{anime.rating}</span>
                  </div>
                </div>
                <div className='p-5'>
                  <h3 className='text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300'>
                    {anime.title}
                  </h3>
                  <p className='text-gray-400 text-sm'>{anime.genre}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-12'>
            <button
              onClick={async () => await navigate('/series')}
              className='px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105'
            >
              View All Anime →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
              Ready to Start Your Journey?
            </h2>
            <p className='text-gray-300 text-lg mb-8 max-w-2xl mx-auto'>
              Join thousands of anime fans tracking their favorite series and discovering new ones every day.
            </p>
            <button
              onClick={async () => await navigate('/series')}
              className='px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-bold text-lg shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105'
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 px-6 border-t border-gray-800'>
        <div className='max-w-6xl mx-auto text-center text-gray-500'>
          <p>© 2025 Anime Database. Track your anime journey with style.</p>
        </div>
      </footer>

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

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}
      </style>
    </main>
  )
}
