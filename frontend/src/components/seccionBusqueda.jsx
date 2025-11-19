import { useState } from 'react';
import { Search, BookOpen, Calendar, TrendingUp, Clock } from 'lucide-react';

const SearchSection = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showResults, setShowResults] = useState(false);

  const filters = [
    { id: 'all', label: 'Todos', icon: BookOpen },
    { id: 'subject', label: 'Asignatura', icon: BookOpen },
    { id: 'semester', label: 'Semestre', icon: Calendar },
    { id: 'trending', label: 'Más valorados', icon: TrendingUp },
    { id: 'recent', label: 'Recientes', icon: Clock }
  ];

  const suggestions = [
    'Cálculo I', 'Programación', 'Química Orgánica', 'Historia del Arte',
    'Estadística', 'Física II', 'Derecho Civil', 'Microeconomía'
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setShowResults(query.length > 0);
    if (onSearch) {
      onSearch(query, activeFilter);
    }
  };

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
    if (searchQuery && onSearch) {
      onSearch(searchQuery, filterId);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSearch(suggestion);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">Buscar apuntes</h2>
      </div>
      
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por asignatura, tema, autor, etiquetas..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-purple-100 text-purple-700 border-2 border-purple-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Suggestions */}
      {searchQuery === '' && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Sugerencias populares:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;