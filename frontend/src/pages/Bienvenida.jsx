import { BookOpen, Users, TrendingUp, Download, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Bienvenida = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                MiEspacioUBB
              </h1>
            </div>

            {/* Main heading */}
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                El espacio académico pensado para ti
              </h2>
              <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
                Comparte y descubre nuevos apuntes hechos a tu medida, porque aprender y crecer es más fácil juntos.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={handleGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group"
              >
                Comenzar experiencia
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Stats */}
            <div className="group relative pt-12 p-8 border-2 border-purple-200 rounded-xl bg-white shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl opacity-5"></div>
              <div className="relative grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-600">10K+</p>
                  <p className="text-gray-600">Apuntes compartidos</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-600">5K+</p>
                  <p className="text-gray-600">Usuarios activos</p>
                </div>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-purple-600">50K+</p>
                  <p className="text-gray-600">Descargas mensuales</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900">¿En que consiste MiEspacioUBB?</h2>
            <p className="text-xl text-gray-600">
              Una plataforma inteligente diseñada para conectar estudiantes, facilitar el aprendizaje colaborativo y reconocer el valor del conocimiento compartido.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-transparent p-8 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Repositorio centralizado</h3>
                <p className="text-gray-600">
                  Acceso a miles de apuntes organizados por materias y niveles académicos. Encuentra exactamente lo que necesitas en segundos.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-transparent p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Comunidad activa</h3>
                <p className="text-gray-600">
                  Conecta con estudiantes de todo el mundo, comparte experiencias, resuelve dudas y aprende colaborativamente.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-transparent p-8 rounded-2xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Gamificación y reputación</h3>
                <p className="text-gray-600">
                  Gana puntos, insignias y reconocimiento por compartir apuntes de calidad. Destaca en la comunidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features with icons */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900">Características destacadas</h3>
            <p className="text-gray-600">
              Herramientas poderosas para optimizar tu experiencia de aprendizaje
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative flex gap-4 p-6 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="relative space-y-2">
                <h4 className="font-bold text-gray-900">Descargas ilimitadas</h4>
                <p className="text-gray-600">Accede a todo el contenido que necesites</p>
              </div>
            </div>

            <div className="group relative flex gap-4 p-6 bg-gradient-to-br from-purple-50 to-transparent rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="relative space-y-2">
                <h4 className="font-bold text-gray-900">Sistema de calificación</h4>
                <p className="text-gray-600">Identifica contenido de alta calidad fácilmente</p>
              </div>
            </div>

            <div className="group relative flex gap-4 p-6 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="relative space-y-2">
                <h4 className="font-bold text-gray-900">Colaboración en tiempo real</h4>
                <p className="text-gray-600">Trabaja y comenta con otros estudiantes</p>
              </div>
            </div>

            <div className="group relative flex gap-4 p-6 bg-gradient-to-br from-emerald-50 to-transparent rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="relative flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="relative space-y-2">
                <h4 className="font-bold text-gray-900">Estadísticas personales</h4>
                <p className="text-gray-600">Monitorea tus aportes y contribuciones</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bienvenida;
