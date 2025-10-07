import { Client } from 'minio';
import { 
  MINIO_ENDPOINT, 
  MINIO_PORT, 
  MINIO_USE_SSL, 
  MINIO_ACCESS_KEY, 
  MINIO_SECRET_KEY, 
  MINIO_BUCKET_NAME,
  SIGNED_URL_EXPIRY 
} from './configEnv.js';

// Configuración de MinIO
const minioConfig = {
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  useSSL: MINIO_USE_SSL === 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
};

// Crear cliente MinIO
export const minioClient = new Client(minioConfig);

// Configuración de buckets
export const BUCKETS = {
  PROFILES: `${MINIO_BUCKET_NAME}-profiles`,
  APUNTES: `${MINIO_BUCKET_NAME}-apuntes`,
};

// Configuración de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',                                                                      // .pdf
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',              // .docx
    'text/plain'                                                                            // .txt
  ],
  SIGNED_URL_EXPIRY: parseInt(SIGNED_URL_EXPIRY) || 3600, // 1 hora por defecto
};

// Función para inicializar MinIO y crear buckets
export async function initializeMinIO() {
  try {
    // Verificar conexión
    await minioClient.listBuckets();
    console.log('[MINIO] Conexión a MinIO establecida correctamente');

    // Crear buckets si no existen
    const bucketsToCreate = [
      BUCKETS.PROFILES,
      BUCKETS.APUNTES
    ];

    for (const bucketName of bucketsToCreate) {
      try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
          await minioClient.makeBucket(bucketName, 'us-east-1');
          console.log(`[MINIO] Bucket creado: ${bucketName}`);
          
          // Configurar política de acceso público para tiles públicos
          if (bucketName.includes('tiles-public')) {
            const publicPolicy = {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Principal: { AWS: ['*'] },
                  Action: ['s3:GetObject'],
                  Resource: [`arn:aws:s3:::${bucketName}/*`]
                }
              ]
            };
            
            await minioClient.setBucketPolicy(bucketName, JSON.stringify(publicPolicy));
            console.log(`[MINIO] Política pública configurada para: ${bucketName}`);
          }
        } else {
          console.log(`[MINIO] Bucket ya existe: ${bucketName}`);
        }
      } catch (error) {
        console.error(`[MINIO] Error creando bucket ${bucketName}:`, error);
      }
    }

    console.log('[MINIO] Inicialización de MinIO completada');
    return true;
  } catch (error) {
    console.error('[MINIO] Error inicializando MinIO:', error);
    throw error;
  }
}

export default minioClient;
