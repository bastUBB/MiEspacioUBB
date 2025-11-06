import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { useState, useContext, useEffect } from 'react';
import { loginService, resendVerificationService } from '../services/auth.service';
import escudoUbb from '@assets/Escudo-ubb.svg';
import iconCorreo from '@assets/IconCorreo.png';
import iconPassword from '@assets/IconContraseña.png';
import fondoLogin from '@assets/FondoLogin4.svg';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [data, setData] = useState({ email: "", password: "" });
    const [showVerificationWarning, setShowVerificationWarning] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    }, [setUser]);

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;
        
        // Validaciones del lado del cliente
        if (!email || !password) {
            toast.error('Por favor, completa todos los campos');
            return;
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Por favor, ingresa un correo electrónico válido');
            return;
        }

        // Validar dominio del email
        if (!email.endsWith('@ubiobio.cl') && !email.endsWith('@alumnos.ubiobio.cl')) {
            toast.error('El correo debe ser institucional (@ubiobio.cl o @alumnos.ubiobio.cl)');
            return;
        }

        // Validar longitud del email
        if (email.length < 10 || email.length > 50) {
            toast.error('El correo debe tener entre 10 y 50 caracteres');
            return;
        }

        // Validar longitud de la contraseña
        if (password.length < 6 || password.length > 26) {
            toast.error('La contraseña debe tener entre 6 y 26 caracteres');
            return;
        }

        // Validar que la contraseña solo contenga letras y números
        const passwordRegex = /^[a-zA-Z0-9]+$/;
        if (!passwordRegex.test(password)) {
            toast.error('La contraseña solo puede contener letras y números');
            return;
        }
        
        const response = await loginService({ email, password });
        
        if (response.status === "Client error" || response.error) {
            const errorMessage = response.message || response.error;
            
            if (errorMessage.includes('verificar tu correo') || errorMessage.includes('verificar su correo')) {
                setPendingEmail(email);
                setShowVerificationWarning(true);
                toast.error(errorMessage, { duration: 5000 });
            } else {
                toast.error(errorMessage);
            }
        } else if (response.status === "Success" && response.data) {
            const { user, token } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('userData', JSON.stringify(user));

            setUser(user);
            setData({ email: "", password: "" });
            toast.success('Login exitoso');

            setTimeout(() => {
                navigate('/');
            }, 100);
        } else {
            toast.error('Estructura de respuesta inesperada');
        }
    };

    const resendVerificationEmail = async () => {
        const response = await resendVerificationService(pendingEmail);
        
        if (response.status === "Success") {
            toast.success('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
            setShowVerificationWarning(false);
        } else {
            toast.error(response.message || 'Error al reenviar el correo');
        }
    };

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
                {/* Cuadro de login */}
                <div className="bg-gradient-to-br from-purple-500 to-cyan-400 bg-opacity-100 p-4 sm:p-6 md:p-8 w-full max-w-sm rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    <img
                        src={escudoUbb}
                        alt="Escudo UBB"
                        className="h-16 sm:h-20 md:h-24 mx-auto mt-4 sm:mt-8 md:mt-12 mb-6 sm:mb-8 md:mb-10"
                    />

                    <form
                        onSubmit={loginUser}
                        className="w-full flex flex-col items-center gap-4 sm:gap-6 text-black font-bold rounded p-2 sm:p-4"
                    >
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

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full max-w-[200px] bg-white text-purple-500 py-2 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-500 hover:text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Iniciar sesión
                        </button>
                        {/* Botón de registro */}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="w-full max-w-[200px] bg-white text-purple-500 py-2 rounded-lg hover:bg-gradient-to-r hover:from-cyan-500 hover:to-purple-600 hover:text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Registrarse
                        </button>

                        {/* Mensaje de verificación pendiente */}
                        {showVerificationWarning && (
                            <div className="mt-2 sm:mt-4 p-3 sm:p-4 bg-purple-50 border-l-4 border-purple-500 text-purple-800 rounded-lg w-full max-w-[280px] shadow-md">
                                <p className="font-bold text-xs sm:text-sm mb-2">⚠️ Verificación pendiente</p>
                                <p className="text-xs mb-2 sm:mb-3">
                                    Debes verificar tu correo electrónico antes de iniciar sesión.
                                </p>
                                <button
                                    type="button"
                                    onClick={resendVerificationEmail}
                                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white py-1 sm:py-1.5 px-3 rounded-lg text-xs hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 shadow-sm"
                                >
                                    Reenviar correo de verificación
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}