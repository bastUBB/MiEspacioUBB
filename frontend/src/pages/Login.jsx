import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContextProvider';
import { useState, useContext } from 'react';

// Importar assets
import escudoUbb from '@assets/Escudo-ubb.svg';
import iconCorreo from '@assets/IconCorreo.png';
import iconPassword from '@assets/IconContraseña.png';
import fondoLogin from '@assets/FondoLogin.svg';

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [data, setData] = useState({ email: "", password: "" });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;
        try {
            const { data: response } = await axios.post('api/auth/login', { email, password });
            
            // Verificar la estructura de la respuesta
            console.log('Respuesta del login:', response);
            
            if (response.status === "Client error" || response.error) {
                toast.error(response.message || response.error);
            } else if (response.status === "Success" && response.data) {
                // El backend devuelve los datos en response.data
                const { user, token } = response.data;
                
                // Guardar en localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('userData', JSON.stringify(user));

                // Actualizar el contexto
                setUser(user);

                setData({ email: "", password: "" });
                toast.success('Login exitoso');

                // Esperar un momento antes de navegar para asegurar que el contexto se actualice
                setTimeout(() => {
                    navigate('/setup-profile');
                }, 100);
            } else {
                toast.error('Estructura de respuesta inesperada');
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error al iniciar sesión");
            }
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

            <div className="relative w-full h-full flex justify-center items-center z-20">
                {/* Cuadro de login */}
                <div className="bg-[#0c549c] bg-opacity-100 p-4 h-[470px] rounded shadow-[0_0_10px_rgba(0,191,255,0.9)]" style={{
                    background: 'linear-gradient(to bottom, #8FD4FF 1%, #0090D9 100%)'
                }}>
                    <img
                        src={escudoUbb}
                        alt="Escudo UBB"
                        className="h-20 mx-auto mt-12 mb-10"
                    />

                    <form
                        onSubmit={loginUser}
                        className="w-full flex flex-col items-center gap-8 text-black font-bold rounded p-4"
                    >
                        {/* Campo de correo */}
                        <div className="relative">
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
                                className="w-[280px] pl-10 p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Campo de contraseña */}
                        <div className="relative">
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
                                className="w-[280px] pl-10 p-2 rounded bg-white text-black border-2 border-gray-300 text-sm"
                            />
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-[200px] bg-white text-[#115397] py-2 rounded hover:bg-[#FBB13C] transition-colors"
                        >
                            Iniciar sesión
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}