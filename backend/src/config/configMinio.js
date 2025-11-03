import {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
  SIGNED_URL_EXPIRY
} from './configEnv.js';
import { Client } from 'minio';

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
  APUNTES_ALG_TRIG: `${MINIO_BUCKET_NAME}-apuntes-alg-trig`,
  APUNTES_INTRO_INGENIERIA: `${MINIO_BUCKET_NAME}-apuntes-intro-ingenieria`,
  APUNTES_COM_ESCR: `${MINIO_BUCKET_NAME}-apuntes-com-escritura`,
  APUNTES_INTRO_PROG: `${MINIO_BUCKET_NAME}-apuntes-intro-prog`,
  APUNTES_CALC_DIF: `${MINIO_BUCKET_NAME}-apuntes-calc-dif`,
  APUNTES_QUIM: `${MINIO_BUCKET_NAME}-apuntes-quim`,
  APUNTES_ESTR_DISC: `${MINIO_BUCKET_NAME}-apuntes-estr-disc`,
  APUNTES_POO: `${MINIO_BUCKET_NAME}-apuntes-poo`,
  APUNTES_CALC_INT: `${MINIO_BUCKET_NAME}-apuntes-calc-int`,
  APUNTES_ALG_LIN: `${MINIO_BUCKET_NAME}-apuntes-alg-lin`,
  APUNTES_FIS_NEWT: `${MINIO_BUCKET_NAME}-apuntes-fis-newt`,
  APUNTES_ESTR_DATS: `${MINIO_BUCKET_NAME}-apuntes-estr-dats`,
  APUNTES_ING_I: `${MINIO_BUCKET_NAME}-apuntes-ing-i`,
  APUNTES_ADMIN_GEN: `${MINIO_BUCKET_NAME}-apuntes-admin-gen`,
  APUNTES_CALC_VV: `${MINIO_BUCKET_NAME}-apuntes-calc-vv`,
  APUNTES_EDO: `${MINIO_BUCKET_NAME}-apuntes-edo`,
  APUNTES_ELECTRO: `${MINIO_BUCKET_NAME}-apuntes-electro`,
  APUNTES_MODEL: `${MINIO_BUCKET_NAME}-apuntes-model`,
  APUNTES_ING_II: `${MINIO_BUCKET_NAME}-apuntes-ing-ii`,
  APUNTES_ONDAS: `${MINIO_BUCKET_NAME}-apuntes-ondas`,
  APUNTES_SIST_DIG: `${MINIO_BUCKET_NAME}-apuntes-sist-dig`,
  APUNTES_FUND_CC: `${MINIO_BUCKET_NAME}-apuntes-fund-cc`,
  APUNTES_TEO_SIST: `${MINIO_BUCKET_NAME}-apuntes-teo-sist`,
  APUNTES_INGLES_III: `${MINIO_BUCKET_NAME}-apuntes-ingles-iii`,
  APUNTES_GEST_CONT: `${MINIO_BUCKET_NAME}-apuntes-gest-cont`,
  APUNTES_ESTADIST: `${MINIO_BUCKET_NAME}-apuntes-estadist`,
  APUNTES_ECONOMIA: `${MINIO_BUCKET_NAME}-apuntes-economia`,
  APUNTES_ADA: `${MINIO_BUCKET_NAME}-apuntes-ada`,
  APUNTES_BD: `${MINIO_BUCKET_NAME}-apuntes-bd`,
  APUNTES_INGLES_IV: `${MINIO_BUCKET_NAME}-apuntes-ingles-iv`,
  APUNTES_IO: `${MINIO_BUCKET_NAME}-apuntes-io`,
  APUNTES_ARQ: `${MINIO_BUCKET_NAME}-apuntes-arq`,
  APUNTES_ADMIN_BD: `${MINIO_BUCKET_NAME}-apuntes-admin-bd`,
  APUNTES_SIST_INFO: `${MINIO_BUCKET_NAME}-apuntes-sist-info`,
  APUNTES_GEST_ESTR: `${MINIO_BUCKET_NAME}-apuntes-gest-estr`,
  APUNTES_GEST_PRE_FIN: `${MINIO_BUCKET_NAME}-apuntes-gest-pre-fin`,
  APUNTES_LEGIS: `${MINIO_BUCKET_NAME}-apuntes-legis`,
  APUNTES_SIST_OP: `${MINIO_BUCKET_NAME}-apuntes-sist-op`,
  APUNTES_IA: `${MINIO_BUCKET_NAME}-apuntes-ia`,
  APUNTES_ISW: `${MINIO_BUCKET_NAME}-apuntes-isw`,
  APUNTES_FEP: `${MINIO_BUCKET_NAME}-apuntes-fep`,
  APUNTES_REDES: `${MINIO_BUCKET_NAME}-apuntes-redes`,
  APUNTES_GPS: `${MINIO_BUCKET_NAME}-apuntes-gps`,
  APUNTES_RRHH: `${MINIO_BUCKET_NAME}-apuntes-rrhh`,
  APUNTES_SEG_INF: `${MINIO_BUCKET_NAME}-apuntes-seg-inf`,
};

export const FILE_CONFIG = {
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB

  SIGNED_URL_EXPIRY: parseInt(SIGNED_URL_EXPIRY) || 3600, // 1 hora por defecto

  MAX_FILE_REQUEST: 1,

  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',                                                          // PDF
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'text/plain'                                                                // TXT
  ],

  ALLOWED_EXTENSIONS: ['.pdf', '.docx', '.txt'],

  // Mapeo de MIME types a extensiones (para referencia)
  MIME_TO_EXTENSION: {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'text/plain': '.txt'
  },

  // Mapeo de extensiones a MIME types (para validación cruzada)
  EXTENSION_TO_MIME: {
    '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain'
  },
};

// Borrar buckets
// export async function deleteAllBuckets() {
//   const buckets = await minioClient.listBuckets();
//   for (const bucket of buckets) {
//     try {
//       await minioClient.removeBucket(bucket.name);
//       console.log(`[MINIO] Bucket eliminado: ${bucket.name}`);
//     } catch (error) {
//       console.error(`[MINIO] Error eliminando bucket ${bucket.name}:`, error);
//     }
//   }
//   return true;
// }

export async function initializeMinIO() {
  try {
    await minioClient.listBuckets();
    console.log('[MINIO] Conexión a MinIO establecida correctamente');
    const bucketsToCreate = Object.values(BUCKETS);
    for (const bucketName of bucketsToCreate) {
      try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
          await minioClient.makeBucket(bucketName, 'us-east-1');
          console.log(`[MINIO] Bucket creado: ${bucketName}`);
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
