# 📚 MiEspacioUBB - Plataforma de Recomendación de Apuntes Académicos

## 📖 Descripción del Proyecto

**MiEspacioUBB** es una **plataforma digital** enfocada en la **recomendación personalizada de apuntes basado en un perfil académico**, diseñada para facilitar y potenciar el **aprendizaje autónomo y colaborativo** entre estudiantes universitarios de la Universidad del Bío-Bío.

La plataforma proporciona un **espacio organizado y dinámico** donde los estudiantes pueden **compartir, descubrir, valorar y consultar apuntes de asignaturas**, adaptados a sus **preferencias personales y estilos de estudio**.

Cada apunte es **etiquetado por asignatura, tema, tipo de material y nivel de dificultad**, permitiendo una organización jerárquica coherente con los programas académicos y facilitando recomendaciones personalizadas altamente relevantes.

---

## 🎯 Objetivos

- Ofrecer un **sistema de recomendación inteligente** que sugiera apuntes académicos relevantes basados en el perfil del estudiante
- Favorecer el **aprendizaje colaborativo** mediante interacción comunitaria y valoración de contenido
- Incentivar la **creación y mejora de material académico** a través de un sistema de reputación
- Proporcionar **estadísticas en tiempo real** del uso y participación en la plataforma
- Implementar herramientas de **análisis y seguimiento académico** personalizadas

---

## ✨ Funcionalidades Principales

### 📝 Gestión de Apuntes

- **Subida de archivos PDF** con almacenamiento en MinIO
- **Organización por asignatura, tema y tipo** (apuntes, resúmenes, ejercicios, guías)
- **Etiquetado automático** y manual para mejor categorización
- **Vista previa integrada** de documentos PDF
- **Control de duplicados** mediante hash SHA-256

### 🎯 Sistema de Recomendación Inteligente

- **Algoritmo personalizado** basado en:
  - Asignaturas actualmente cursadas
  - Historial de visualizaciones y descargas
  - Valoraciones previas
  - Nivel de complejidad preferido
  - Tipo de material favorito
- **Diversificación de resultados** para exploración
- **Adaptación continua** al comportamiento del usuario

### ⭐ Valorización Comunitaria

- **Sistema de calificación** (5 estrellas)
- **Comentarios y discusiones** en cada apunte
- **Respuestas anidadas** para conversaciones
- **Likes/Dislikes** en comentarios
- **Sistema de reportes** para contenido inapropiado

### 👤 Perfil Académico

- **Gestión de asignaturas inscritas** por semestre
- **Estilo de aprendizaje** (visual, auditivo, kinestésico, lectura/escritura)
- **Nivel de complejidad preferido**
- **Historial completo** de interacciones
- **Estadísticas personales** de uso

### 📊 Dashboard de Estadísticas (Tiempo Real)

- **Métricas principales:**

  - Total de apuntes activos
  - Usuarios registrados
  - **Usuarios activos en vivo** (Socket.IO)
  - Descargas totales del sistema

- **Gráficos interactivos:**

  - Distribución por tipo de material
  - Top 5 asignaturas con más apuntes
  - Crecimiento mensual de contenido

- **Highlights semanales:**
  - Apuntes más populares
  - Top contribuidores
  - Apunte legendario (más descargado de todos los tiempos)

### 🔔 Sistema de Notificaciones

- **Notificaciones en tiempo real** de:
  - Nuevos comentarios en tus apuntes
  - Respuestas a tus comentarios
  - Valoraciones recibidas
  - Actualización de estado de apuntes
- **Centro de notificaciones** con historial completo
- **Indicador visual** de notificaciones no leídas

### 🔍 Búsqueda y Filtrado Avanzado

- **Búsqueda por texto** en nombres y descripciones
- **Filtros múltiples:**
  - Asignatura
  - Tipo de material
  - Nivel de complejidad
  - Rango de valoración
- **Ordenamiento flexible** por relevancia, fecha, valoración o descargas

### 🏆 Sistema de Reputación

- **Ranking de contribuidores** por cantidad y calidad de aportes
- **Visibilidad destacada** a usuarios con mejor reputación
- **Indicadores de calidad** en cada apunte

### 🔐 Autenticación y Seguridad

- **Registro con verificación** de correo institucional (@ubiobio.cl)
- **Sistema de roles** (estudiante, ayudante, docente, admin)
- **Validación RUT** chileno
- **Tokens JWT** con cookies HTTP-only
- **Protección de rutas** según permisos

---

## 🛠️ Stack Tecnológico

### Frontend

- **React.js** con Vite
- **React Router** para navegación SPA
- **Socket.IO Client** para comunicación en tiempo real
- **Recharts** para visualización de datos
- **Lucide React** para iconografía
- **Tailwind CSS** para estilos (diseño personalizado purple/violet/indigo)
- **Axios** para peticiones HTTP
- **React Hot Toast** para notificaciones

### Backend

- **Node.js** con Express
- **Socket.IO** para WebSocket real-time
- **MongoDB** con Mongoose (metadatos)
- **MinIO** (almacenamiento de PDFs)
- **JWT** para autenticación
- **Bcrypt** para hash de contraseñas
- **Nodemailer** para emails
- **Joi** para validaciones

### Infraestructura

- **GitHub Actions** para CI/CD
- **Apache** como reverse proxy
- **PM2** para gestión de procesos Node.js
- **OpenVPN** para acceso seguro a red universitaria

---

## 📂 Estructura del Proyecto

```text
backend/
├─ src/
│  ├─ config/         # BD, MinIO, Socket.IO, variables de entorno
│  ├─ controllers/    # Lógica de orquestación por recurso
│  ├─ middlewares/    # Autenticación, autorización, errores
│  ├─ models/         # Schemas Mongoose (User, Apunte, Comentario, etc.)
│  ├─ routes/         # Definición de endpoints REST
│  ├─ services/       # Lógica de negocio y algoritmos
│  ├─ validations/    # Schemas Joi para validación de datos
│  ├─ helpers/        # Funciones utilitarias
│  └─ index.js        # Punto de entrada con Socket.IO
├─ package.json
└─ .gitignore

frontend/
├─ src/
│  ├─ components/     # Componentes reutilizables
│  ├─ context/        # Context API (User, Socket)
│  ├─ pages/          # Vistas principales (Home, Explorar, Estadísticas, etc.)
│  ├─ services/       # Servicios para API calls
│  ├─ utils/          # Utilidades frontend
│  └─ App.jsx         # Componente raíz con rutas
├─ package.json
└─ vite.config.js

.github/
└─ workflows/
   └─ test_deploy_faceubb.yml  # Pipeline CI/CD automatizado
```

---

## 🚀 Características Técnicas Destacadas

### Socket.IO - Comunicación en Tiempo Real

- **Tracking de usuarios activos** con Map en memoria
- **Eventos personalizados:**
  - `user:register` - Usuario se conecta
  - `users:count` - Broadcast de conteo actualizado
  - `disconnect` - Usuario se desconecta
- **Configuración CORS** apropiada para producción
- **Integración con Apache** via `proxy_wstunnel`

### Algoritmo de Recomendación

- **5 dimensiones de scoring:**
  1. Coincidencia de asignatura
  2. Valoración comunitaria
  3. Popularidad (vistas + descargas)
  4. Complejidad adecuada
  5. Tipo de material preferido
- **Factores multiplicadores:** Asignatura cursante actual (x2.5)
- **Diversificación:** Top 70% + 30% aleatorio
- **Adaptación:** Aprende del historial del usuario

### Sistema de Almacenamiento

- **Metadatos en MongoDB:** Referencias, usuarios, comentarios, estadísticas
- **PDFs en MinIO:** Buckets por asignatura, presigned URLs, duplicate detection
- **Hash SHA-256:** Prevención de duplicados exactos
- **Categorización automática:** Por nombre de archivo y metadatos

---

## 📊 Métricas y Monitoreo

- **15 endpoints de estadísticas** con datos en tiempo real
- **Dashboard visual** con gráficos interactivos
- **Tracking de:**
  - Usuarios activos simultáneos
  - Apuntes más visualizados/descargados
  - Contribuidores destacados semanales
  - Tendencias de crecimiento mensual
  - Distribución por tipo de contenido

---

## 🌐 Despliegue y Producción

### CI/CD Automatizado

1. **Tests** en MongoDB temporal
2. **Conexión VPN** a red universitaria
3. **Deploy SSH** automático
4. **Actualización** de código y dependencias
5. **Build** de frontend optimizado
6. **Configuración Apache** automática
7. **Reinicio** de servicios con PM2

### Configuración Apache (Puerto 1804)

- Proxy reverso para API `/api/`
- **Soporte WebSocket** para `/socket.io/`
- Fallback a `index.html` para React Router
- Headers CORS apropiados

---

## 🔮 Futuras Extensiones

- Generación automática de **quizzes de repaso** (NLP)
- Herramientas de **comparación de rendimiento académico**
- **Gamificación** con logros y recompensas
- **Chat en tiempo real** entre estudiantes
- **Grupos de estudio** virtuales
- **Integración con calendario académico** UBB
- **Aplicación móvil** nativa

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.  
Puedes usar, copiar, modificar y distribuir el código con o sin fines comerciales, siempre que incluyas el aviso de copyright original.

Consulta el archivo [LICENSE](LICENSE) para más información.

---

## 👥 Contribuidores

Proyecto desarrollado como **Trabajo de Título** en la Universidad del Bío-Bío, Facultad de Ciencias Empresariales, Carrera de Ingeniería Civil en Informática.

**Desarrollado con ❤️ para la comunidad estudiantil UBB**
