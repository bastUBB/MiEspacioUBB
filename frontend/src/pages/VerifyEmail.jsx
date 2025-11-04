import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Importar assets
import escudoUbb from '@assets/Escudo-ubb.svg';
import fondoLogin from '@assets/FondoLogin4.svg';

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const hasVerified = useRef(false); // Prevenir múltiples ejecuciones

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token || userData) {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
        }
    }, []);

    useEffect(() => {
        const verifyEmail = async () => {
            // Prevenir ejecuciones duplicadas
            if (hasVerified.current) return;
            
            if (!token) {
                setStatus('error');
                setMessage('Token de verificación no proporcionado');
                return;
            }

            hasVerified.current = true; // Marcar como ejecutado

            try {
                const response = await axios.get(`/api/auth/verify-email/${token}`);

                // console.log("Response: ", response);
                
                // Verificar el status dentro de response.data
                if (response.data.status === "Success") {
                    setStatus('success');
                    setMessage('¡Tu correo ha sido verificado exitosamente!');
                    
                    localStorage.setItem('emailVerified', 'true');
                    
                    toast.success('Email verificado correctamente. Redirigiendo al login...');
                    
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.data.message || 'Error al verificar el correo');
                    toast.error(response.data.message || 'Error al verificar el correo');
                }
            } catch (error) {
                console.error("Verification error:", error);
                setStatus('error');
                const errorMessage = error.response?.data?.details || error.response?.data?.message || 'Error al verificar el correo. El token puede haber expirado.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: `url(${fondoLogin})`,
                }}
            />

            <div className="relative w-full h-full flex justify-center items-center z-20">
                <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md text-center">
                    <img
                        src={escudoUbb}
                        alt="Escudo UBB"
                        className="h-20 mx-auto mb-6"
                    />
                    
                    {status === 'verifying' && (
                        <div>
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Verificando tu correo...
                            </h2>
                            <p className="text-gray-600">
                                Por favor espera un momento
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div>
                            <svg 
                                className="w-16 h-16 mx-auto text-green-500 mb-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            
                            <h2 className="text-2xl font-bold text-green-600 mb-2">
                                ¡Verificación Exitosa!
                            </h2>
                            
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>

                            <p className="text-sm text-gray-500 mb-4">
                                Serás redirigido al login en unos segundos...
                            </p>
                            
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                Ir al Login ahora
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <svg 
                                className="w-16 h-16 mx-auto text-red-500 mb-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                            
                            <h2 className="text-2xl font-bold text-red-600 mb-2">
                                Error en la verificación
                            </h2>
                            
                            <p className="text-gray-600 mb-6">
                                {message}
                            </p>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Solicitar nuevo correo de verificación
                                </button>
                                
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                                >
                                    Ir al Login
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
