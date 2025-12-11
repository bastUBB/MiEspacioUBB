import PropTypes from 'prop-types';

export default function FullScreenBackground({ children, backgroundImage, backgroundColor = 'bg-gray-100', className = '' }) {
    return (
        <div className="page-container">
            {/* Fondo fijo que nunca muestra espacios blancos */}
            <div
                className={`fixed-background ${!backgroundImage ? backgroundColor : ''}`}
                style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
            />

            {/* Contenido de la página */}
            <div className={`page-content ${className}`}>
                {children}
            </div>
        </div>
    );
}

FullScreenBackground.propTypes = {
    children: PropTypes.node.isRequired,
    backgroundImage: PropTypes.string,
    backgroundColor: PropTypes.string,
    className: PropTypes.string
};
