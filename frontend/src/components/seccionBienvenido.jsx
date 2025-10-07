import { TrendingUp, Clock, Star } from 'lucide-react';

const WelcomeSection = ({ userName, recentActivity }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {userName} 👋
          </h1>
          <p className="text-gray-600">
            Descubre y comparte conocimiento académico con tu comunidad universitaria
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Subidos</p>
            <p className="text-xl font-bold text-purple-600">{recentActivity.notesUploaded}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-violet-100 rounded-full mb-2">
              <Clock className="w-6 h-6 text-violet-600" />
            </div>
            <p className="text-sm text-gray-600">Descargados</p>
            <p className="text-xl font-bold text-violet-600">{recentActivity.notesDownloaded}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-2">
              <Star className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-sm text-gray-600">Valoración</p>
            <p className="text-xl font-bold text-indigo-600">{recentActivity.averageRating.toFixed(1)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;