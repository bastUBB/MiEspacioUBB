import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import Header from '../components/header';
import {
  obtenerTotalApuntesActivosService,
  obtenerTotalUsuariosService,
  obtenerDescargasTotalesService,
  obtenerDistribucionTiposService,
  obtenerTop5AsignaturasService,
  obtenerCrecimientoMensualService,
  obtenerApuntesPopularesSemanaService,
  obtenerTopContribuidoresSemanaService,
  obtenerApunteMasDescargadoService
} from '../services/estadisticas.service';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { TrendingUp, Users, FileText, Download, Trophy, Star, Flame } from 'lucide-react';

export default function Estadisticas() {
  const { usuariosActivos } = useSocket();

  // Hero metrics
  const [totalApuntes, setTotalApuntes] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [descargasTotales, setDescargasTotales] = useState(0);

  // Charts data
  const [distribucionTipos, setDistribucionTipos] = useState([]);
  const [topAsignaturas, setTopAsignaturas] = useState([]);
  const [crecimiento, setCrecimiento] = useState([]);

  // Week highlights
  const [popularesSemana, setPopularesSemana] = useState([]);
  const [topContribuidores, setTopContribuidores] = useState([]);
  const [apunteMasDescargado, setApunteMasDescargado] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [
        apuntesRes,
        usuariosRes,
        descargasRes,
        tiposRes,
        asignaturasRes,
        crecimientoRes,
        popularesRes,
        contribuidoresRes,
        masDescargadoRes
      ] = await Promise.all([
        obtenerTotalApuntesActivosService(),
        obtenerTotalUsuariosService(),
        obtenerDescargasTotalesService(),
        obtenerDistribucionTiposService(),
        obtenerTop5AsignaturasService(),
        obtenerCrecimientoMensualService(),
        obtenerApuntesPopularesSemanaService(),
        obtenerTopContribuidoresSemanaService(),
        obtenerApunteMasDescargadoService()
      ]);

      if (apuntesRes?.data) setTotalApuntes(apuntesRes.data.total);
      if (usuariosRes?.data) setTotalUsuarios(usuariosRes.data.total);
      if (descargasRes?.data) setDescargasTotales(descargasRes.data.total);
      if (tiposRes?.data) setDistribucionTipos(tiposRes.data);
      if (asignaturasRes?.data) setTopAsignaturas(asignaturasRes.data);
      if (crecimientoRes?.data) setCrecimiento(crecimientoRes.data);
      if (popularesRes?.data) setPopularesSemana(popularesRes.data);
      if (contribuidoresRes?.data) setTopContribuidores(contribuidoresRes.data);
      if (masDescargadoRes?.data) setApunteMasDescargado(masDescargadoRes.data);

      setLoading(false);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#9333ea', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas del Sistema</h1>
          <p className="text-gray-600">Panel de métricas y análisis en tiempo real</p>
        </div>

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            IconComponent={FileText}
            title="Total Apuntes"
            value={totalApuntes}
            color="purple"
          />
          <MetricCard
            IconComponent={Users}
            title="Usuarios Registrados"
            value={totalUsuarios}
            color="pink"
          />
          <MetricCard
            IconComponent={Users}
            title="Usuarios Activos"
            value={usuariosActivos}
            color="indigo"
            live
          />
          <MetricCard
            IconComponent={Download}
            title="Descargas Totales"
            value={descargasTotales}
            color="violet"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribucion Tipos */}
          <ChartCard title="Distribución por Tipo de Material">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribucionTipos}
                  dataKey="cantidad"
                  nameKey="tipo"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {distribucionTipos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Asignaturas */}
          <ChartCard title="Top 5 Asignaturas con Más Apuntes">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAsignaturas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="nombre" angle={-15} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#9333ea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Crecimiento Mensual - TEMPORALMENTE OCULTO
        <ChartCard title="Crecimiento Mensual de Contenido (Últimos 6 Meses)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={crecimiento}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cantidad" stroke="#9333ea" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        */}

        {/* Highlights Row - TEMPORALMENTE OCULTO
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <HighlightCard
            title="Populares Esta Semana"
            IconComponent={Flame}
          >
            {popularesSemana.length > 0 ? (
              <ul className="space-y-2">
                {popularesSemana.map((apunte, idx) => (
                  <li key={idx} className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                    <span className="text-sm font-medium text-gray-900 truncate">{apunte.nombre}</span>
                    <span className="text-xs text-purple-600 font-semibold">{apunte.visualizaciones} vistas</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No hay datos esta semana</p>
            )}
          </HighlightCard>

          <HighlightCard
            title="Top Contribuidores"
            IconComponent={Trophy}
          >
            {topContribuidores.length > 0 ? (
              <ul className="space-y-2">
                {topContribuidores.map((contrib, idx) => (
                  <li key={idx} className="flex justify-between items-center p-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100">
                    <span className="text-sm font-medium text-gray-900 truncate">{contrib.nombre}</span>
                    <span className="text-xs text-violet-600 font-semibold">{contrib.cantidadApuntes} apuntes</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No hay datos esta semana</p>
            )}
          </HighlightCard>

          <HighlightCard
            title="Apunte Legendario"
            IconComponent={Star}
          >
            {apunteMasDescargado ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-bold text-purple-700 mb-2">{apunteMasDescargado.nombre}</h4>
                <p className="text-sm text-gray-600 mb-3">{apunteMasDescargado.asignatura}</p>
                <div className="flex justify-between text-xs text-gray-700">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{apunteMasDescargado.descargas}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{apunteMasDescargado.visualizaciones}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay datos disponibles</p>
            )}
          </HighlightCard>
        </div>
        */}
      </div>
    </div>
  );
}

// Componentes auxiliares
function MetricCard({ IconComponent, title, value, color, live }) {
  const colorStyles = {
    purple: {
      bg: 'from-white to-purple-50/50',
      border: 'border-purple-100',
      icon: 'text-purple-200',
      textColor: 'text-purple-600',
      bgBadge: 'bg-purple-50'
    },
    pink: {
      bg: 'from-white to-pink-50/50',
      border: 'border-pink-100',
      icon: 'text-pink-200',
      textColor: 'text-pink-600',
      bgBadge: 'bg-pink-50'
    },
    indigo: {
      bg: 'from-white to-indigo-50/50',
      border: 'border-indigo-100',
      icon: 'text-indigo-200',
      textColor: 'text-indigo-600',
      bgBadge: 'bg-indigo-50'
    },
    violet: {
      bg: 'from-white to-violet-50/50',
      border: 'border-violet-100',
      icon: 'text-violet-200',
      textColor: 'text-violet-600',
      bgBadge: 'bg-violet-50'
    }
  };

  const styles = colorStyles[color];

  return (
    <div className={`bg-gradient-to-br ${styles.bg} rounded-xl p-4 shadow-sm border ${styles.border} hover:shadow-md transition-all hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <IconComponent className={`w-8 h-8 ${styles.icon}`} />
        {live && (
          <span className={`text-xs font-medium ${styles.textColor} ${styles.bgBadge} px-2 py-1 rounded-full flex items-center gap-1`}>
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></span>
            EN VIVO
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-xs text-gray-500">{title}</p>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function HighlightCard({ title, IconComponent, children }) {
  return (
    <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-xl shadow-sm border border-purple-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <IconComponent className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
