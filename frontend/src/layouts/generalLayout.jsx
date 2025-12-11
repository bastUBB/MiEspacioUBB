import { Outlet } from 'react-router-dom';

export default function GeneralLayout() {
    return (
        <div className="page-container">
            {/* Fondo fijo con gradiente */}
            <div
                className="fixed-background"
                style={{
                    background: 'linear-gradient(to bottom, #e6e5e5ff, #ffffff 30%)'
                }}
            />

            {/* Contenido con scroll */}
            <div className="page-content overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
