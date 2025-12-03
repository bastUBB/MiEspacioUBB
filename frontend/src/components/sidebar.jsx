import { TrendingUp, Award, Users, FileText, Star, Trophy, Eye, BookOpen } from 'lucide-react';

const Sidebar = ({ topContributors, topNotes, topMostViewedNotes = [], topSubjects = [] }) => {
  return (
    <div className="space-y-6">
      {/* Top Contributors */}
      <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
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
      <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Apuntes más valorados</h3>
        </div>

        <div className="space-y-3">
          {topNotes.length > 0 ? (
            topNotes.map((note, index) => (
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
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Apuntes más visualizados */}
      <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Apuntes más vistos</h3>
        </div>

        <div className="space-y-3">
          {topMostViewedNotes.length > 0 ? (
            topMostViewedNotes.map((note, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-3">
                <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">{note.subject}</p>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-500">{note.views}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Asignaturas con más apuntes */}
      <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">Asignaturas populares</h3>
        </div>

        <div className="space-y-3">
          {topSubjects.length > 0 ? (
            topSubjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full flex-shrink-0">
                    <span className="text-xs font-bold text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{subject.name}</p>
                </div>
                <span className="text-sm font-bold text-green-600 ml-2">{subject.count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No hay datos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;