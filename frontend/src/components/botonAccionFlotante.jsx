import { useState } from 'react';
import { Plus, Upload, ClipboardList, X } from 'lucide-react';

const FloatingActionButton = ({ onUploadClick, onCreateSurveyClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Menu Items */}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>

        {/* Crear Encuesta Button */}
        <div className="flex items-center gap-3 group">
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Crear Encuesta
          </div>
          <button
            onClick={() => {
              onCreateSurveyClick();
              setIsOpen(false);
            }}
            className="w-12 h-12 bg-white text-pink-600 hover:bg-pink-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-pink-100"
          >
            <ClipboardList className="w-6 h-6" />
          </button>
        </div>

        {/* Subir Apunte Button */}
        <div className="flex items-center gap-3 group">
          <div className="bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Subir Apunte
          </div>
          <button
            onClick={() => {
              onUploadClick();
              setIsOpen(false);
            }}
            className="w-12 h-12 bg-white text-purple-600 hover:bg-purple-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center border border-purple-100"
          >
            <Upload className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'rotate-45' : 'rotate-0'}`}
      >
        <Plus className="w-8 h-8 text-white transition-transform duration-300" />
      </button>
    </div>
  );
};

export default FloatingActionButton;