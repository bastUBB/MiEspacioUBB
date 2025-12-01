import { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { BookOpen, MessageSquare } from 'lucide-react';
import Header from '../components/header';
import ExplorarApuntes from './ExplorarApuntes';
import ExploradorEncuestas from './ExploradorEncuestas';

function Explorar() {
    const { user, loading: userLoading } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Obtener tab desde URL o default a 'apuntes'
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'apuntes');

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    // Sincronizar tab con URL
    useEffect(() => {
        setSearchParams({ tab: activeTab }, { replace: true });
    }, [activeTab, setSearchParams]);

    const tabs = [
        { id: 'apuntes', name: 'Apuntes', icon: BookOpen },
        { id: 'encuestas', name: 'Encuestas', icon: MessageSquare }
    ];

    if (userLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                notificationCount={0}
                notifications={[]}
                onHomeClick={() => navigate('/estudiante/home')}
                onProfileClick={() => navigate('/estudiante/profile')}
                onExplorarClick={() => { }} // Ya estamos aquí
                onMisApuntesClick={() => navigate('/estudiante/mis-aportes')}
                onEstadisticasClick={() => navigate('/estudiante/estadisticas')}
                onEncuestasClick={() => setActiveTab('encuestas')}
                onLogout={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userData');
                    navigate('/login');
                }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
                    <div className="flex border-b border-gray-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === tab.id
                                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div>
                    {activeTab === 'apuntes' && <ExplorarApuntes embedded={true} />}
                    {activeTab === 'encuestas' && <ExploradorEncuestas embedded={true} />}
                </div>
            </div>
        </div>
    );
}

export default Explorar;
