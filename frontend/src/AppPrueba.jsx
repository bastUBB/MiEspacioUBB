import { useState } from 'react';
import Header from './components/header';
import WelcomeSection from './components/seccionBienvenido';
import SearchSection from './components/seccionBusqueda';
import RecommendationsSection from './components/seccionRecomendacion';
import Sidebar from './components/sidebar';
import FloatingActionButton from './components/botonAccionFlotante';
import NoteView from './components/noteView';

// Mock data
const mockNotes = [
  {
    id: '1',
    title: 'Fundamentos de Cálculo Diferencial',
    author: 'María González',
    subject: 'Matemáticas',
    rating: 5,
    downloads: 1247,
    preview: 'Apuntes completos sobre límites, derivadas y aplicaciones del cálculo diferencial. Incluye ejemplos prácticos y ejercicios resueltos.',
    tags: ['Cálculo', 'Derivadas', 'Límites']
  },
  {
    id: '2',
    title: 'Introducción a la Programación Orientada a Objetos',
    author: 'Carlos Rodríguez',
    subject: 'Informática',
    rating: 4,
    downloads: 892,
    preview: 'Conceptos fundamentales de POO: clases, objetos, herencia, polimorfismo. Ejemplos en Java y Python.',
    tags: ['POO', 'Java', 'Python']
  },
  {
    id: '3',
    title: 'Química Orgánica: Reacciones y Mecanismos',
    author: 'Ana López',
    subject: 'Química',
    rating: 5,
    downloads: 654,
    preview: 'Estudio detallado de reacciones orgánicas, mecanismos de reacción y síntesis orgánica básica.',
    tags: ['Química', 'Orgánica', 'Reacciones']
  },
  {
    id: '4',
    title: 'Historia del Arte Medieval',
    author: 'Diego Martín',
    subject: 'Historia',
    rating: 4,
    downloads: 423,
    preview: 'Análisis del arte medieval europeo: románico, gótico, arte bizantino. Incluye imágenes y análisis detallado.',
    tags: ['Arte', 'Medieval', 'Gótico']
  },
  {
    id: '5',
    title: 'Estadística Descriptiva e Inferencial',
    author: 'Laura Sánchez',
    subject: 'Estadística',
    rating: 5,
    downloads: 789,
    preview: 'Conceptos básicos de estadística, medidas de tendencia central, distribuciones y pruebas de hipótesis.',
    tags: ['Estadística', 'Probabilidad', 'Inferencia']
  },
  {
    id: '6',
    title: 'Física II: Electricidad y Magnetismo',
    author: 'Roberto Ruiz',
    subject: 'Física',
    rating: 4,
    downloads: 567,
    preview: 'Fundamentos de electricidad y magnetismo, ecuaciones de Maxwell, campos eléctricos y magnéticos.',
    tags: ['Física', 'Electricidad', 'Magnetismo']
  }
];

const mockUserStats = {
  notesUploaded: 12,
  ratingsReceived: 48,
  reputation: 856
};

const mockTopContributors = [
  { name: 'María González', contributions: 23 },
  { name: 'Carlos Rodríguez', contributions: 18 },
  { name: 'Ana López', contributions: 15 }
];

const mockTopNotes = [
  { title: 'Cálculo Diferencial Avanzado', rating: 4.9, author: 'María González' },
  { title: 'Algoritmos y Estructuras de Datos', rating: 4.8, author: 'Carlos Rodríguez' },
  { title: 'Química Orgánica Completa', rating: 4.7, author: 'Ana López' }
];

const mockRecentActivity = {
  notesUploaded: 3,
  notesDownloaded: 12,
  averageRating: 4.7
};

const mockNoteData = {
  id: '1',
  title: 'Fundamentos de Cálculo Diferencial',
  subject: 'Matemáticas Discretas',
  author: {
    name: 'María González',
    reputation: 856,
  },
  uploadDate: '15 de Marzo, 2024',
  downloads: 1247,
  rating: 4.8,
  totalRatings: 156,
  content: `# Introducción al Cálculo Diferencial

El cálculo diferencial es una rama fundamental de las matemáticas que se ocupa del estudio de las tasas de cambio y las pendientes de las curvas. En este apunte, exploraremos los conceptos básicos y las aplicaciones prácticas de esta disciplina.

## Conceptos Fundamentales

### Límites
El concepto de límite es la base del cálculo diferencial. Un límite describe el comportamiento de una función cuando la variable independiente se aproxima a un valor específico.

**Definición formal:** Sea f(x) una función definida en un intervalo que contiene a 'a', excepto posiblemente en 'a' mismo. Decimos que el límite de f(x) cuando x tiende a 'a' es L, y escribimos:

lim(x→a) f(x) = L

### Derivadas
La derivada de una función en un punto representa la tasa de cambio instantánea de la función en ese punto. Geométricamente, la derivada es la pendiente de la recta tangente a la curva en ese punto.

**Definición:** La derivada de f(x) en el punto x = a se define como:

f'(a) = lim(h→0) [f(a+h) - f(a)] / h

## Reglas de Derivación

### Regla de la Potencia
Si f(x) = x^n, entonces f'(x) = n·x^(n-1)

### Regla del Producto
Si f(x) = u(x)·v(x), entonces f'(x) = u'(x)·v(x) + u(x)·v'(x)

### Regla de la Cadena
Si f(x) = g(h(x)), entonces f'(x) = g'(h(x))·h'(x)

## Aplicaciones Prácticas

El cálculo diferencial tiene numerosas aplicaciones en:
- Física: velocidad, aceleración, optimización
- Economía: análisis marginal, elasticidad
- Ingeniería: diseño de sistemas, control de procesos
- Biología: modelos de crecimiento poblacional

## Ejercicios Resueltos

**Ejercicio 1:** Encuentra la derivada de f(x) = 3x² + 2x - 5

Solución:
f'(x) = 6x + 2

**Ejercicio 2:** Calcula la derivada de g(x) = (2x + 1)³

Solución:
Usando la regla de la cadena:
g'(x) = 3(2x + 1)² · 2 = 6(2x + 1)²

## Conclusión

El cálculo diferencial es una herramienta poderosa que nos permite analizar y comprender el comportamiento de las funciones. Su dominio es esencial para el éxito en cursos avanzados de matemáticas, física e ingeniería.`,
  tags: ['Cálculo', 'Derivadas', 'Límites', 'Matemáticas'],
  comments: [
    {
      id: '1',
      author: 'Carlos Rodríguez',
      content: 'Excelente explicación de los conceptos fundamentales. Los ejemplos están muy claros.',
      date: '16 de Marzo, 2024',
      likes: 12,
      dislikes: 0
    },
    {
      id: '2',
      author: 'Ana López',
      content: '¿Podrías agregar más ejercicios sobre la regla de la cadena? Me parece un tema complejo.',
      date: '17 de Marzo, 2024',
      likes: 8,
      dislikes: 1
    },
    {
      id: '3',
      author: 'Diego Martín',
      content: 'Muy útil para repasar antes del examen. Gracias por compartir!',
      date: '18 de Marzo, 2024',
      likes: 15,
      dislikes: 0
    }
  ]
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleUploadClick = () => {
    alert('Abrir modal de subida de apuntes');
  };

  const handleNoteClick = () => {
    setCurrentView('note');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (currentView === 'note') {
    return <NoteView note={mockNoteData} onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        userName="Estudiante" 
        notificationCount={3} 
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <WelcomeSection 
              userName="Estudiante" 
              recentActivity={mockRecentActivity}
            />
            <SearchSection />
            <RecommendationsSection 
              notes={mockNotes} 
              onNoteClick={handleNoteClick}
            />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              userStats={mockUserStats}
              topContributors={mockTopContributors}
              topNotes={mockTopNotes}
            />
          </div>
        </div>
      </div>
      
      <FloatingActionButton onClick={handleUploadClick} />
    </div>
  );
}

export default App;