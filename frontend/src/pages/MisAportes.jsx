import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { BookOpen, MessageSquare, AlertTriangle } from 'lucide-react';
import Header from '../components/header';
import ListaApuntes from '../components/listaApuntes';
import ListaEncuestas from '../components/listaEncuestas';
import ListaReportes from '../components/listaReportes';

function MisAportes() {
    const { user, loading: userLoading } = useContext(UserContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('apuntes');

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    const tabs = [
        { id: 'apuntes', name: 'Mis Apuntes', icon: BookOpen },
        { id: 'encuestas', name: 'Mis Encuestas', icon: MessageSquare },
        { id: 'reportes', name: 'Reportes Realizados', icon: AlertTriangle }
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
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-purple-50 via-violet-50 to-indigo-50 rounded-2xl p-8 mb-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Aportes</h1>
                    <p className="text-gray-600">Gestiona tus apuntes y encuestas compartidas con la comunidad</p>
                </div>

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
                    {activeTab === 'apuntes' && <ListaApuntes rutUser={user?.rut} />}
                    {activeTab === 'encuestas' && <ListaEncuestas rutUser={user?.rut} />}
                    {activeTab === 'reportes' && <ListaReportes rutUser={user?.rut} />}
                </div>
            </div>
        </div>
    );
}

export default MisAportes;
