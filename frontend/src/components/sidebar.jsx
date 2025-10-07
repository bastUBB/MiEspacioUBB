import { TrendingUp, Award, Users, FileText, Star, Trophy } from 'lucide-react';

const Sidebar = ({ userStats, topContributors, topNotes }) => {
  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Tus estadísticas</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Apuntes subidos</span>
            </div>
            <span className="text-lg font-bold text-purple-600">{userStats.notesUploaded}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Valoraciones recibidas</span>
            </div>
            <span className="text-lg font-bold text-yellow-500">{userStats.ratingsReceived}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-600">Reputación</span>
            </div>
            <span className="text-lg font-bold text-indigo-600">{userStats.reputation}</span>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Top contribuidores</h3>
        </div>
        
        <div className="space-y-3">
          {topContributors.map((contributor, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.contributions} contribuciones</p>
              </div>
              <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full">
                <span className="text-xs font-bold text-purple-600">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Notes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Apuntes más valorados</h3>
        </div>
        
        <div className="space-y-3">
          {topNotes.map((note, index) => (
            <div key={index} className="border-l-4 border-purple-200 pl-3">
              <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500">por {note.author}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500">{note.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;