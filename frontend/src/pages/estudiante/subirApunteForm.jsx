import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

export default function SubirApunteForm() {
  const [formData, setFormData] = useState({
    name: '',
    authors: '',
    description: '',
    subject: '',
    noteType: '',
    file: null,
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, file: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#6E52D9] to-[#5643A8] px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <FileText size={28} />
            Subir Apunte
          </h2>
          <p className="text-[#CBCDFA] mt-1 text-sm">
            Completa la información para compartir tu apunte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-[#4D398A] mb-2">
              Nombre del Apunte *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
              placeholder="Ej: Resumen de Álgebra Lineal"
            />
          </div>

          <div>
            <label htmlFor="authors" className="block text-sm font-semibold text-[#4D398A] mb-2">
              Autores *
            </label>
            <input
              type="text"
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
              placeholder="Ej: Juan Pérez, María García"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-[#4D398A] mb-2">
              Descripción Breve *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors resize-none"
              placeholder="Describe brevemente el contenido del apunte..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-[#4D398A] mb-2">
                Asignatura *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors"
                placeholder="Ej: Matemáticas"
              />
            </div>

            <div>
              <label htmlFor="noteType" className="block text-sm font-semibold text-[#4D398A] mb-2">
                Tipo de Apunte *
              </label>
              <select
                id="noteType"
                name="noteType"
                value={formData.noteType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#6E52D9] focus:outline-none transition-colors bg-white"
              >
                <option value="">Selecciona un tipo</option>
                <option value="resumen">Resumen</option>
                <option value="guia">Guía de Ejercicios</option>
                <option value="teoria">Teoría</option>
                <option value="practica">Práctica</option>
                <option value="parcial">Parcial Resuelto</option>
                <option value="otros">Otros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#4D398A] mb-2">
              Archivo *
            </label>

            {!formData.file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive
                    ? 'border-[#6E52D9] bg-[#E2E4FD]'
                    : 'border-gray-300 hover:border-[#6E52D9] hover:bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />
                <Upload className="mx-auto mb-4 text-[#6E52D9]" size={48} />
                <p className="text-[#4D398A] font-semibold mb-1">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500">
                  PDF, DOC, DOCX, TXT, PPT, PPTX (Máx. 10MB)
                </p>
              </div>
            ) : (
              <div className="border-2 border-[#6E52D9] rounded-lg p-4 bg-[#F5F5FF]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#6E52D9] p-2 rounded-lg">
                      <FileText className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#4D398A]">{formData.file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="text-red-500" size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6E52D9] to-[#5643A8] text-white font-semibold py-4 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Subir Apunte
          </button>
        </form>
      </div>
    </div>
  );
}
