import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContextProvider';
import { registerService, resendVerificationService } from '../services/auth.service';

// Importar assets
import escudoUbb from '@assets/Escudo-ubb.svg';
import iconCorreo from '@assets/IconCorreo.png';
import iconPassword from '@assets/IconContraseña.png';
import fondoLogin from '@assets/FondoLogin4.svg';

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [data, setData] = useState({ 
        nombreCompleto: "",
        rut: "",
        email: "", 
        password: "",
        role: "Estudiante"
    });
    const [registeredEmail, setRegisteredEmail] = useState(null);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    }, [setUser]);

    const registerUser = async (e) => {
        e.preventDefault();
        const { nombreCompleto, rut, email, password, role } = data;
        
        const response = await registerService({ 
            nombreCompleto, 
            rut, 
            email, 
            password, 
            role 
        });
        
        if (response.status === "Client error" || response.error) {
            toast.error(response.message || response.error);
        } else if (response.status === "Success") {
            toast.success('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.');
            setRegisteredEmail(email);
        } else {
            toast.error('Estructura de respuesta inesperada');
        }
    };

    const resendVerificationEmail = async () => {
        if (!registeredEmail) return;
        
        setIsResending(true);
        const response = await resendVerificationService(registeredEmail);
        
        if (response.status === "Success") {
            toast.success('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
        } else {
            toast.error(response.message || 'Error al reenviar el correo');
        }
        setIsResending(false);
    };

    // Verificar si el usuario abrió el enlace de verificación
    useEffect(() => {
        // Escuchar eventos de storage para detectar cuando se verifica el email
        const handleStorageChange = (e) => {
            if (e.key === 'emailVerified' && e.newValue === 'true') {
                localStorage.removeItem('emailVerified');
                toast.success('¡Email verificado con éxito! Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [navigate]);

    // Si ya se registró, mostrar pantalla de verificación
    if (registeredEmail) {
        return (
            <div className="w-screen h-screen relative overflow-hidden">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                    style={{
                        backgroundImage: `url(${fondoLogin})`,
                    }}
                />

                <div className="relative w-full h-full flex justify-center items-center z-20 px-4 sm:px-6">
                    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] w-full max-w-sm text-center">
                        <img
                            src={escudoUbb}
                            alt="Escudo UBB"
                            className="h-16 sm:h-20 md:h-24 mx-auto mb-4 sm:mb-6"
                        />
                        
                        <div className="mb-4 sm:mb-6">
                            <svg 
                                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-purple-500 mb-3 sm:mb-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                />
                            </svg>
                            
                            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                                Verifica tu correo electrónico
                            </h2>
                            
                            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                                Hemos enviado un correo de verificación a:
                            </p>
                            
                            <p className="text-sm sm:text-base text-purple-600 font-semibold mb-4 sm:mb-6 break-words">
                                {registeredEmail}
                            </p>
                            
                            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                                Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación para activar tu cuenta.
                            </p>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                            <button
                                onClick={resendVerificationEmail}
                                disabled={isResending}
                                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed"
                            >
                                {isResending ? 'Reenviando...' : 'Reenviar correo de verificación'}
                            </button>
                            
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Ir al Login
                            </button>
                            
                            <button
                                onClick={() => setRegisteredEmail(null)}
                                className="w-full text-purple-600 hover:text-cyan-500 hover:underline text-sm transition-colors"
                            >
                                Volver al registro
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen relative overflow-hidden">
            {/* Imagen de fondo */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: `url(${fondoLogin})`,
                }}
            />

            <div className="relative w-full h-full flex justify-center items-center z-20 px-4 sm:px-6">
                {/* Cuadro de registro */}
                <div className="bg-gradient-to-br from-purple-500 to-cyan-400 bg-opacity-100 p-4 sm:p-6 md:p-8 w-full max-w-sm rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    <img
                        src={escudoUbb}
                        alt="Escudo UBB"
                        className="h-16 sm:h-20 md:h-24 mx-auto mt-2 sm:mt-4 md:mt-6 mb-4 sm:mb-6"
                    />

                    <form
                        onSubmit={registerUser}
                        className="w-full flex flex-col items-center gap-3 sm:gap-4 text-black font-bold rounded p-2 sm:p-4"
                    >
                        {/* Campo de nombre completo */}
                        <div className="relative w-full max-w-[280px]">
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={data.nombreCompleto}
                                onChange={(e) => setData({ ...data, nombreCompleto: e.target.value })}
                                required
                                className="w-full p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Campo de RUT */}
                        <div className="relative w-full max-w-[280px]">
                            <input
                                type="text"
                                placeholder="RUT (ej: 12345678-9 o 12.345.678-9)"
                                value={data.rut}
                                onChange={(e) => setData({ ...data, rut: e.target.value })}
                                required
                                className="w-full p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Campo de correo */}
                        <div className="relative w-full max-w-[280px]">
                            <img
                                src={iconCorreo}
                                alt="icono correo"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-30"
                            />
                            <input
                                type="email"
                                placeholder="Correo institucional"
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                required
                                className="w-full pl-10 p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Campo de contraseña */}
                        <div className="relative w-full max-w-[280px]">
                            <img
                                src={iconPassword}
                                alt="icono contraseña"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-30"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                                required
                                className="w-full pl-10 p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Campo de rol */}
                        <div className="relative w-full max-w-[280px]">
                            <select
                                value={data.role}
                                onChange={(e) => setData({ ...data, role: e.target.value })}
                                required
                                className="w-full p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            >
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="Personal">Ayudante</option>
                            </select>
                        </div>

                        {/* Botón de registro */}
                        <button
                            type="submit"
                            className="w-full max-w-[200px] bg-white text-purple-600 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-500 hover:text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg mt-1 sm:mt-2"
                        >
                            Registrarse
                        </button>
                        
                        {/* Botón para volver al login */}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="w-full max-w-[200px] bg-white text-cyan-600 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 hover:text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Volver al Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}