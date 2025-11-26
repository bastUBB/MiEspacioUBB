# Capítulo: Arquitectura del Sistema

## 1. Visión General de la Arquitectura

MiEspacioUBB está construido bajo una arquitectura **cliente-servidor de tres capas** que separa claramente las responsabilidades entre presentación, lógica de negocio y persistencia de datos. El sistema implementa un patrón **Model-View-Controller (MVC)** en el backend y una arquitectura basada en componentes en el frontend, garantizando escalabilidad, mantenibilidad y separación de responsabilidades.

La plataforma está desplegada en un servidor de la Universidad del Bío-Bío (IP: 146.83.194.142) y es accesible a través de la red local universitaria o mediante VPN, asegurando el acceso exclusivo a la comunidad universitaria.

### 1.1 Diagrama de Arquitectura General

![Arquitectura del Sistema](C:/Users/basti/.gemini/antigravity/brain/ad37b3a6-f617-41d0-85db-39b4fbe5b497/uploaded_image_1764086085178.png)

La figura muestra los componentes principales del sistema:

- **Capa de Presentación**: Aplicación web React.js servida a través de Apache HTTP Server
- **Capa de Aplicación**: Backend Node.js + Express para lógica de negocio
- **Capa de Datos**: MongoDB para metadatos y MinIO para almacenamiento de documentos
- **Infraestructura**: Contenedores Docker para aislamiento y portabilidad

---

## 2. Arquitectura Frontend

### 2.1 Tecnologías y Dependencias

El frontend está desarrollado con las siguientes tecnologías:

| Tecnología           | Versión | Propósito                                 |
| -------------------- | ------- | ----------------------------------------- |
| **React**            | 19.1.1  | Framework principal de UI                 |
| **Vite**             | 7.1.7   | Build tool y bundler de desarrollo        |
| **React Router DOM** | 7.6.1   | Navegación y enrutamiento                 |
| **Axios**            | 1.12.2  | Cliente HTTP para APIs                    |
| **TailwindCSS**      | 4.1.13  | Framework de estilos utility-first        |
| **Radix UI**         | 2.x     | Componentes accesibles (dropdowns, slots) |
| **React Hot Toast**  | 2.5.2   | Sistema de notificaciones                 |
| **React PDF**        | 10.2.0  | Visualización de documentos PDF           |
| **jsPDF**            | 3.0.1   | Generación de PDFs                        |
| **xlsx**             | 0.18.5  | Exportación de datos a Excel              |

### 2.2 Estructura de Directorios

```
frontend/
├── src/
│   ├── assets/          # Recursos estáticos (imágenes, íconos)
│   ├── components/      # Componentes reutilizables de UI
│   ├── context/         # Contextos de React (AuthContext)
│   ├── helpers/         # Funciones utilitarias
│   ├── hooks/           # Custom hooks de React
│   ├── layouts/         # Plantillas de layout (AdminLayout, UserLayout)
│   ├── pages/           # Componentes de páginas/vistas
│   ├── services/        # Servicios para comunicación con API
│   ├── App.jsx          # Componente principal con rutas
│   ├── main.jsx         # Punto de entrada de la aplicación
│   └── index.css        # Estilos globales
├── public/              # Archivos públicos estáticos
├── vite.config.js       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind
└── package.json         # Dependencias y scripts
```

### 2.3 Configuración de Vite

El sistema utiliza **Vite** como herramienta de desarrollo y construcción por su velocidad y optimización:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
    },
  },
});
```

**Características clave:**

- **Aliases de importación**: Simplifica imports con rutas absolutas
- **Hot Module Replacement (HMR)**: Actualización instantánea durante desarrollo
- **Tree-shaking**: Eliminación de código no utilizado en producción
- **Code-splitting**: Carga diferida de componentes

### 2.4 Servicios de Frontend

La comunicación con el backend se centraliza en servicios especializados:

- `authService.js`: Autenticación y manejo de sesiones
- `apunteService.js`: Gestión de apuntes (CRUD, descarga, valoración)
- `userService.js`: Gestión de usuarios
- `asignaturaService.js`: Consulta de asignaturas
- `perfilAcademicoService.js`: Gestión de perfiles académicos
- `comentarioService.js`: Sistema de comentarios
- `notificacionService.js`: Notificaciones en tiempo real
- `recomendacionService.js`: Obtención de recomendaciones personalizadas

Todos los servicios utilizan **Axios** con configuración global para:

- Interceptores de autenticación (JWT en headers)
- Manejo centralizado de errores
- Timeout de requests
- Transformación de respuestas

### 2.5 Gestión de Estado

El estado global se maneja mediante:

1. **Context API de React**:

   - `AuthContext`: Estado de autenticación y usuario actual
   - Gestión de tokens JWT en localStorage

2. **Estado local**:
   - `useState` para estado de componentes
   - `useEffect` para efectos secundarios y llamadas a API

---

## 3. Arquitectura Backend

### 3.1 Tecnologías y Dependencias

El backend está construido con Node.js y las siguientes dependencias principales:

| Dependencia      | Versión | Propósito                              |
| ---------------- | ------- | -------------------------------------- |
| **Express**      | 5.1.0   | Framework web para APIs REST           |
| **Mongoose**     | 8.17.0  | ODM para MongoDB                       |
| **MinIO**        | 8.0.6   | Cliente para almacenamiento de objetos |
| **jsonwebtoken** | 9.0.2   | Autenticación JWT                      |
| **bcryptjs**     | 3.0.2   | Hash de contraseñas                    |
| **Joi**          | 17.13.3 | Validación de esquemas                 |
| **Multer**       | 2.0.2   | Upload de archivos multipart           |
| **cors**         | 2.8.5   | Control de acceso CORS                 |
| **dotenv**       | 17.2.1  | Gestión de variables de entorno        |
| **nodemailer**   | 7.0.10  | Envío de correos (verificación)        |
| **moment**       | 2.30.1  | Manipulación de fechas                 |

### 3.2 Estructura de Directorios (Patrón MVC)

```
backend/src/
├── config/              # Configuraciones del sistema
│   ├── configEnv.js     # Variables de entorno
│   ├── configDb.js      # Conexión a MongoDB
│   ├── configMinio.js   # Configuración de MinIO
│   └── initialSetup.js  # Inicialización de datos
├── controllers/         # Controladores (orquestación)
│   ├── apunte.controller.js
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── perfilAcademico.controller.js
│   ├── recomendacion.controller.js
│   ├── comentario.controller.js
│   ├── notificacion.controller.js
│   └── reporte.controller.js
├── services/            # Lógica de negocio
│   ├── apunte.service.js
│   ├── auth.service.js
│   ├── recomendacion.service.js
│   └── ...
├── models/              # Modelos de datos (Mongoose)
│   ├── user.model.js
│   ├── apunte.model.js
│   ├── perfilAcademico.model.js
│   ├── comentario.model.js
│   ├── notificacion.model.js
│   └── reporte.model.js
├── routes/              # Definición de endpoints
│   ├── index.routes.js  # Agregador de rutas
│   ├── apunte.routes.js
│   ├── auth.routes.js
│   └── ...
├── middlewares/         # Middlewares personalizados
│   ├── auth.middleware.js         # Verificación JWT
│   ├── archivo.middleware.js      # Procesamiento de archivos
│   └── contentFilter.middleware.js # Filtrado de contenido
├── validations/         # Validación con Joi
│   ├── apunte.validation.js
│   ├── perfilAcademico.validation.js
│   └── ...
├── helpers/             # Funciones auxiliares
│   └── recomendacion.helper.js
└── index.js             # Punto de entrada del servidor
```

### 3.3 Inicialización del Servidor

El archivo `index.js` configura e inicia el servidor Express:

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/configDb.js";
import { initializeMinIO } from "./config/configMinio.js";
import { initialSetup } from "./config/initialSetup.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

// Configuración de CORS
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    const allowedOrigins = [FRONTEND_URL];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api", indexRoutes);

app.listen(PORT, async () => {
  await connectDB(); // Conectar a MongoDB
  await initializeMinIO(); // Inicializar buckets MinIO
  await initialSetup(); // Crear datos iniciales
});
```

### 3.4 Endpoints de la API

El sistema expone los siguientes grupos de endpoints REST bajo el prefijo `/api`:

| Ruta Base              | Propósito                                     | Controlador                |
| ---------------------- | --------------------------------------------- | -------------------------- |
| `/api/auth`            | Autenticación (login, registro, verificación) | auth.controller            |
| `/api/users`           | Gestión de usuarios                           | user.controller            |
| `/api/asignaturas`     | Consulta de asignaturas                       | asignatura.controller      |
| `/api/perfilAcademico` | Perfiles académicos de estudiantes            | perfilAcademico.controller |
| `/api/apuntes`         | CRUD de apuntes, valoración, descarga         | apunte.controller          |
| `/api/comentarios`     | Sistema de comentarios y respuestas           | comentario.controller      |
| `/api/reportes`        | Reportes de contenido inapropiado             | reporte.controller         |
| `/api/notificaciones`  | Notificaciones de usuarios                    | notificacion.controller    |
| `/api/recomendaciones` | Algoritmo de recomendaciones                  | recomendacion.controller   |
| `/api/historial`       | Historial de interacciones                    | historial.controller       |

### 3.5 Middlewares del Sistema

#### 3.5.1 Autenticación JWT (`auth.middleware.js`)

Protege rutas requiriendo un token JWT válido:

```javascript
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autorizado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};
```

#### 3.5.2 Procesamiento de Archivos (`archivo.middleware.js`)

Gestiona la carga de archivos con Multer:

- Validación de tipo MIME (PDF, DOCX, TXT)
- Límite de tamaño (20MB)
- Un archivo por request

#### 3.5.3 Filtrado de Contenido (`contentFilter.middleware.js`)

Sanitiza entrada de usuarios para prevenir:

- Inyección de código
- XSS (Cross-Site Scripting)
- Contenido malicioso

### 3.6 Validación de Datos (Joi)

Todos los endpoints validan datos de entrada con esquemas Joi:

```javascript
// Ejemplo: validations/apunte.validation.js
export const createApunteSchema = Joi.object({
  nombre: Joi.string().min(3).max(100).required(),
  descripcion: Joi.string().min(10).max(500).required(),
  asignatura: Joi.string().required(),
  tipoApunte: Joi.string().valid('Resumen', 'Ejercicios resueltos', ...).required(),
  etiquetas: Joi.array().items(Joi.string()).max(10)
});
```

---

## 4. Capa de Persistencia

### 4.1 Base de Datos MongoDB

**Propósito**: Almacenamiento de metadatos y datos estructurados del sistema.

#### 4.1.1 Modelos de Datos Principales

El sistema utiliza los siguientes modelos Mongoose:

**1. User (users)**

```javascript
{
  nombreCompleto: String,
  rut: String (unique),
  email: String (unique),
  password: String (hashed con bcrypt),
  role: String ('admin' | 'student'),
  isVerified: Boolean,
  verificationToken: String,
  notificaciones: [ObjectId],
  reportes: [ObjectId],
  estado: String ('activo' | 'suspendido' | 'baneado')
}
```

**2. Apunte (apuntes)**

```javascript
{
  nombre: String,
  autorSubida: String,
  rutAutorSubida: String,
  autores: [String],
  descripcion: String,
  asignatura: String,
  fechaSubida: String,
  tipoApunte: String,
  valoracion: {
    cantidadValoraciones: Number,
    promedioValoracion: Number
  },
  visualizaciones: Number,
  descargas: Number,
  etiquetas: [String],
  archivo: {
    nombreOriginal: String,
    nombreArchivo: String,
    rutaCompleta: String,
    tamano: Number,
    tipoMime: String,
    bucket: String,
    objectName: String
  },
  estado: String ('Activo' | 'Bajo Revisión' | 'Suspendido'),
  comentarios: [ObjectId],
  reportes: [ObjectId]
}
```

**3. PerfilAcademico (perfilacademicos)**

```javascript
{
  rutUser: String (unique),
  asignaturasCursantes: [String],
  asignaturasInteres: [String],
  metodosEstudiosPreferidos: [String],
  informeCurricular: [{
    asignatura: String,
    evaluaciones: [{
      nombre: String,
      nota: Number,
      porcentaje: Number
    }],
    promedioFinal: Number
  }],
  historialInteracciones: [{
    apunteId: ObjectId,
    accion: String,
    fecha: Date
  }]
}
```

**4. Comentario (comentarios)**

```javascript
{
  contenido: String,
  rutUser: String,
  nombreUser: String,
  apunteId: ObjectId,
  fechaCreacion: Date,
  likes: Number,
  dislikes: Number,
  esRespuesta: Boolean,
  comentarioPadreId: ObjectId,
  respuestas: [ObjectId]
}
```

**5. Notificacion (notificacions)**

```javascript
{
  rutUser: String,
  tipo: String,
  mensaje: String,
  fecha: Date,
  leida: Boolean,
  relacionadoId: ObjectId
}
```

**6. Reporte (reportes)**

```javascript
{
  rutUserReportante: String,
  tipoElemento: String,
  elementoId: ObjectId,
  razon: String,
  descripcion: String,
  estado: String,
  fechaReporte: Date
}
```

#### 4.1.2 Conexión a MongoDB

```javascript
// config/configDb.js
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`[MONGODB] ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MONGODB] Error: ${error.message}`);
    process.exit(1);
  }
};
```

**Características:**

- Conexión mediante Mongoose ODM
- Validación de esquemas automática
- Indexes automáticos en campos únicos (rut, email)
- Relaciones mediante referencias (ObjectId)

### 4.2 Almacenamiento de Objetos MinIO

**Propósito**: Almacenamiento de archivos binarios de apuntes (PDF, DOCX, TXT).

#### 4.2.1 Configuración de MinIO

```javascript
// config/configMinio.js
const minioConfig = {
  endPoint: MINIO_ENDPOINT, // IP del servidor MinIO
  port: parseInt(MINIO_PORT), // Puerto 9000
  useSSL: false, // Sin SSL en red interna
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
};

export const minioClient = new Client(minioConfig);
```

#### 4.2.2 Organización de Buckets

MinIO organiza los archivos en **buckets por asignatura**:

```javascript
export const BUCKETS = {
  PROFILES: "miespacioubb-profiles",
  APUNTES_INTRO_PROG: "miespacioubb-apuntes-intro-prog",
  APUNTES_POO: "miespacioubb-apuntes-poo",
  APUNTES_ESTR_DATS: "miespacioubb-apuntes-estr-dats",
  APUNTES_BD: "miespacioubb-apuntes-bd",
  APUNTES_IA: "miespacioubb-apuntes-ia",
  // ... 40+ asignaturas más
};
```

**Ventajas de esta estructura:**

- Organización lógica por materia
- Permisos granulares por bucket
- Escalabilidad horizontal
- Facilita backups selectivos

#### 4.2.3 Inicialización Automática

```javascript
export async function initializeMinIO() {
  const bucketsToCreate = Object.values(BUCKETS);
  for (const bucketName of bucketsToCreate) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName, "us-east-1");
      console.log(`[MINIO] Bucket creado: ${bucketName}`);
    }
  }
}
```

#### 4.2.4 Flujo de Subida de Archivos

1. **Cliente** envía POST multipart con archivo
2. **Multer middleware** valida tipo y tamaño
3. **Controller** genera nombre único (UUID)
4. **Service** determina bucket según asignatura
5. **MinIO Client** sube archivo al bucket
6. **MongoDB** guarda metadatos con referencia a MinIO
7. **Cliente** recibe confirmación

#### 4.2.5 Generación de URLs Firmadas

Para descargas seguras sin exponer credenciales:

```javascript
const downloadUrl = await minioClient.presignedGetObject(
  bucket,
  objectName,
  SIGNED_URL_EXPIRY // 3600 segundos (1 hora)
);
```

**Beneficios:**

- URLs temporales con expiración
- No requiere autenticación adicional
- No expone credenciales de MinIO
- Control sobre tiempo de acceso

#### 4.2.6 Configuración de Archivos Permitidos

```javascript
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
  MAX_FILE_REQUEST: 1,
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".docx", ".txt"],
};
```

---

## 5. Comunicación entre Capas

### 5.1 Protocolo de Comunicación

**Frontend ↔ Backend**: REST API sobre HTTP/HTTPS

```
Cliente Web (React)
      ↓ HTTP Request (JSON)
   API Gateway (Express)
      ↓ Middleware Chain
   Controller (Orquestación)
      ↓ Business Logic
   Service Layer
      ↓ Data Access
   Model (Mongoose/MinIO)
      ↓
   Database/Storage
```

### 5.2 Formato de Respuestas

Todas las respuestas siguen un formato estandarizado:

**Respuesta Exitosa:**

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": {
    /* Datos solicitados */
  }
}
```

**Respuesta de Error:**

```json
{
  "success": false,
  "message": "Descripción del error",
  "errors": [
    /* Detalles específicos */
  ]
}
```

### 5.3 Autenticación y Autorización

**Flujo de Autenticación:**

1. Usuario envía credenciales a `/api/auth/login`
2. Backend valida contra MongoDB
3. Si válido, genera JWT con payload:
   ```javascript
   {
     rut: user.rut,
     role: user.role,
     email: user.email,
     exp: Date.now() + 24h
   }
   ```
4. Cliente almacena token en localStorage
5. Requests subsecuentes incluyen header:
   ```
   Authorization: Bearer <token>
   ```
6. Middleware `verifyToken` valida en cada request

**Niveles de Acceso:**

- **Público**: Endpoints sin autenticación (login, registro)
- **Autenticado**: Requiere JWT válido
- **Admin**: Requiere JWT con role='admin'

---

## 6. Despliegue en Producción

### 6.1 Servidor Universitario

**Especificaciones:**

- **IP**: 146.83.194.142
- **Red**: Red local Universidad del Bío-Bío
- **Acceso**: VPN para acceso remoto
- **Sistema Operativo**: Linux (Docker Host)

### 6.2 Contenedorización con Docker

El sistema utiliza **Docker** para:

- Aislamiento de servicios
- Portabilidad entre entornos
- Facilidad de despliegue
- Gestión de dependencias

**Contenedores:**

**Contenedor 1 - Backend Stack (IP: 146.83.194.142)**

```
┌─────────────────────────────────────┐
│      MongoDB (Base de Datos)        │
│      Puerto: 27017                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   Apache HTTP Server (Reverse Proxy)│
│      Puerto: 80/443                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│   Node.js + Express (Backend API)   │
│      Puerto: 1004 (interno)         │
└─────────────────────────────────────┘
```

**Contenedor 2 - MinIO (IP: 146.83.194.142)**

```
┌─────────────────────────────────────┐
│   MinIO Object Storage              │
│      API: Puerto 9000               │
│      Console: Puerto 9001           │
└─────────────────────────────────────┘
```

### 6.3 Apache HTTP Server

**Funciones:**

1. **Reverse Proxy**: Redirige requests al backend Node.js
2. **Servidor de Estáticos**: Sirve archivos del frontend React
3. **SSL/TLS Termination**: Maneja HTTPS (si aplica)
4. **Load Balancing**: Distribuye carga (escalabilidad futura)

**Configuración típica:**

```apache
<VirtualHost *:80>
    ServerName 146.83.194.142

    # Frontend estático
    DocumentRoot /var/www/html/frontend/dist

    # Proxy para API backend
    ProxyPass /api http://localhost:1004/api
    ProxyPassReverse /api http://localhost:1004/api
</VirtualHost>
```

### 6.4 Variables de Entorno

El sistema utiliza archivos `.env` para configuración:

**Backend (.env):**

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/miespacioubb
MONGO_URI_TEST=mongodb://localhost:27017/miespacioubb_test

# MinIO
MINIO_ENDPOINT=146.83.194.142
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=*******
MINIO_SECRET_KEY=*******
MINIO_BUCKET_NAME=miespacioubb
SIGNED_URL_EXPIRY=3600

# JWT
JWT_SECRET=*******

# URLs
BACKEND_URL=http://146.83.194.142:1004
FRONTEND_URL=http://146.83.194.142

# Email (Nodemailer)
EMAIL_USER=*******
EMAIL_PASSWORD=*******
```

**Frontend (.env):**

```env
VITE_API_URL=http://146.83.194.142:1004/api
```

### 6.5 Scripts de Ejecución

**Backend:**

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "vitest"
  }
}
```

**Frontend:**

```json
{
  "scripts": {
    "dev": "vite", // Desarrollo local
    "build": "vite build", // Build para producción
    "preview": "vite preview" // Preview del build
  }
}
```

---

## 7. Seguridad del Sistema

### 7.1 Seguridad en Backend

**Medidas implementadas:**

1. **Hashing de Contraseñas**:

   - bcrypt con salt rounds automático
   - Nunca se almacenan contraseñas en texto plano

2. **JWT con Expiración**:

   - Tokens expiran en 24 horas
   - Firmados con secreto JWT_SECRET
   - Validación en cada request protegido

3. **Validación de Entrada (Joi)**:

   - Esquemas estrictos para todos los endpoints
   - Sanitización de datos de usuario
   - Prevención de inyección SQL/NoSQL

4. **CORS Restrictivo**:

   - Solo permite origen del frontend oficial
   - Credenciales habilitadas solo para frontend confiable

5. **Validación de Archivos**:

   - Whitelist de tipos MIME permitidos
   - Límite de tamaño (20MB)
   - Nombres de archivo sanitizados (UUID)

6. **Rate Limiting** (recomendado implementar):
   - Limitar requests por IP
   - Prevenir ataques de fuerza bruta

### 7.2 Seguridad en Frontend

1. **Tokens en localStorage**:

   - Tokens JWT almacenados localmente
   - Eliminados al logout
   - Interceptores Axios incluyen token automáticamente

2. **Sanitización de Inputs**:

   - Validación en cliente antes de enviar
   - Doble validación con backend

3. **HTTPS en Producción**:
   - Comunicación encriptada (recomendado)
   - Certificados SSL/TLS

### 7.3 Seguridad de Red

1. **Red Interna Universitaria**:

   - Acceso restringido a red UBB
   - VPN obligatoria para acceso remoto

2. **Firewall**:
   - Solo puertos necesarios expuestos (80, 443, 1004)
   - MinIO solo accesible desde backend

---

## 8. Escalabilidad y Rendimiento

### 8.1 Estrategias de Escalabilidad

**Escalabilidad Horizontal:**

- Backend stateless (JWT sin sesiones en servidor)
- Permite múltiples instancias Node.js detrás de load balancer
- MongoDB con replica sets para alta disponibilidad
- MinIO con cluster distribuido

**Escalabilidad Vertical:**

- Incremento de recursos del servidor (CPU, RAM)
- Optimización de queries MongoDB (indexes)
- Cacheo de respuestas frecuentes (Redis - futuro)

### 8.2 Optimizaciones de Rendimiento

**Backend:**

- Indexes en MongoDB (rut, email, asignatura)
- Paginación de resultados (límites en queries)
- Lazy loading de relaciones (populate selectivo)
- Compresión de respuestas JSON (gzip)

**Frontend:**

- Code splitting con React.lazy()
- Optimización de imágenes (WebP, lazy loading)
- Memoización de componentes (React.memo)
- Virtualización de listas largas
- Build optimizado con Vite (minificación, tree-shaking)

**MinIO:**

- Distribución geográfica de buckets
- CDN para archivos estáticos (futuro)
- URLs firmadas con cache-control

---

## 9. Monitoreo y Logging

### 9.1 Logging del Sistema

**Backend (Console Logging):**

```javascript
console.log("[MONGODB] Conexión establecida");
console.log("[MINIO] Bucket creado: miespacioubb-apuntes-ia");
console.error("[ERROR] Error en validación:", error.message);
```

**Niveles de Log:**

- `INFO`: Operaciones normales
- `WARN`: Advertencias no críticas
- `ERROR`: Errores que requieren atención

### 9.2 Monitoreo Recomendado (Futuro)

- **PM2**: Gestor de procesos Node.js con restart automático
- **Morgan**: Logger HTTP para Express
- **Winston**: Sistema de logging avanzado
- **Sentry**: Tracking de errores en producción
- **Prometheus + Grafana**: Métricas de sistema

---

## 10. Consideraciones Técnicas

### 10.1 Ventajas de la Arquitectura

✅ **Separación de responsabilidades**: Frontend, backend, datos independientes  
✅ **Escalabilidad**: Componentes pueden escalar independientemente  
✅ **Mantenibilidad**: Código modular y organizado (MVC)  
✅ **Seguridad**: Múltiples capas de validación y autenticación  
✅ **Portabilidad**: Docker facilita despliegue en diferentes entornos  
✅ **Testabilidad**: Separación permite testing unitario e integración

### 10.2 Limitaciones Actuales

⚠️ **Sin balanceador de carga**: Una sola instancia de backend  
⚠️ **Sin cacheo**: Cada request consulta base de datos  
⚠️ **Sin CDN**: Archivos servidos directamente desde MinIO  
⚠️ **Logging básico**: Console.log sin agregación centralizada  
⚠️ **Sin CI/CD**: Despliegue manual

### 10.3 Mejoras Futuras

**Corto plazo:**

1. Implementar Redis para cacheo de recomendaciones
2. Agregar PM2 para gestión de procesos
3. Configurar SSL/TLS con Let's Encrypt
4. Implementar rate limiting

**Mediano plazo:**

1. Configurar MongoDB replica set
2. Integrar sistema de logging centralizado (ELK Stack)
3. CI/CD con GitHub Actions
4. Métricas con Prometheus

**Largo plazo:**

1. Migrar a Kubernetes para orquestación
2. CDN para distribución de archivos estáticos
3. Microservicios (separar recomendaciones, archivos)
4. Message queue para procesamiento asíncrono (Bull/RabbitMQ)

---

## 11. Conclusión

La arquitectura de MiEspacioUBB implementa una solución robusta, escalable y mantenible para la gestión y recomendación de apuntes académicos. La separación clara entre frontend React, backend Node.js/Express, base de datos MongoDB y almacenamiento MinIO garantiza:

- **Modularidad**: Cada componente puede evolucionar independientemente
- **Seguridad**: Múltiples capas de protección desde JWT hasta validación de archivos
- **Rendimiento**: Optimizaciones en cada capa (indexes, code-splitting, URLs firmadas)
- **Escalabilidad**: Diseño que permite crecimiento horizontal y vertical

El uso de tecnologías modernas y ampliamente adoptadas (React, Node.js, MongoDB, Docker) asegura la sostenibilidad del proyecto y facilita la incorporación de nuevos desarrolladores.
