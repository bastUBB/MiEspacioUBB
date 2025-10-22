const bucketAsignatura = {
    "Algebra y Trigonometria": "APUNTES_ALG_TRIG",
    "Introduccion a la Ingenieria": "APUNTES_INTRO_INGENIERIA",
    "Comunicacion Oral y Escrita": "APUNTES_COM_ESCR",
    "Introduccion a la Programacion": "APUNTES_INTRO_PROG",
    "Calculo Diferencial": "APUNTES_CALC_DIF",
    "Quimica General": "APUNTES_QUIM",
    "Estructuras Discretas para Cs. de la Comp.": "APUNTES_ESTR_DISC",
    "Programacion Orientada a Objeto": "APUNTES_POO",
    "Calculo Integral": "APUNTES_CALC_INT",
    "Algebra Lineal": "APUNTES_ALG_LIN",
    "Fisica Newtoniana": "APUNTES_FIS_NEWT",
    "Estructuras de Datos": "APUNTES_ESTR_DATS",
    "Ingles I": "APUNTES_ING_I",
    "Administracion General": "APUNTES_ADMIN_GEN",
    "Calculo en Varias Variables": "APUNTES_CALC_VV",
    "Ecuaciones Diferenciales": "APUNTES_EDO",
    "Electromagnetismo": "APUNTES_ELECTRO",
    "Modelamiento de Procesos e Información": "APUNTES_MODEL",
    "Ingles II": "APUNTES_ING_II",
    "Ondas, Optica y Fisica Moderna": "APUNTES_ONDAS",
    "Sistemas Digitales": "APUNTES_SIST_DIG",
    "Fundamentos de Ciencias de la Computacion": "APUNTES_FUND_CC",
    "Teoria de Sistemas": "APUNTES_TEO_SIST",
    "Ingles III": "APUNTES_INGLES_III",
    "Gestion Contable": "APUNTES_GEST_CONT",
    "Estadistica y Probabilidades": "APUNTES_ESTADIST",
    "Economia": "APUNTES_ECONOMIA",
    "Analisis y Diseño de Algoritmos": "APUNTES_ADA",
    "Base de Datos": "APUNTES_BD",
    "Ingles IV": "APUNTES_INGLES_IV",
    "Investigacion de Operaciones": "APUNTES_IO",
    "Arquitectura de Computadores": "APUNTES_ARQ",
    "Administracion y Prog. de Base de Datos": "APUNTES_ADMIN_BD",
    "Sistemas de Informacion": "APUNTES_SIST_INFO",
    "Gestion Estrategica": "APUNTES_GEST_ESTR",
    "Gestion Presupuestaria y Financiera": "APUNTES_GEST_PRE_FIN",
    "Legislacion": "APUNTES_LEGIS",
    "Sistemas Operativos": "APUNTES_SIST_OP",
    "Inteligencia Artificial": "APUNTES_IA",
    "Ingenieria de Software": "APUNTES_ISW",
    "Formulacion y Evaluacion de Proyectos": "APUNTES_FEP",
    "Comunicacion de Datos y Redes": "APUNTES_REDES",
    "Gestion de Proyectos de Software": "APUNTES_GPS",
    "Gestion de Recursos Humanos": "APUNTES_RRHH",
    "Seguridad Informatica": "APUNTES_SEG_INF"
};

export function asignarBucket(nombreAsignatura) {
    try {        
        const normalizado = nombreAsignatura.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (!normalizado) return [null, `Asignatura no reconocida: ${nombreAsignatura}`];

        const bucketName = bucketAsignatura[normalizado];

        if (!bucketName) return [null, `Asignatura no reconocida luego de la normalización: ${normalizado}`];

        const abreviacionAsignatura = bucketName.replace("APUNTES_", "");

        return [bucketName, abreviacionAsignatura, null];

    } catch (error) {
        console.error('Error asignando bucket:', error);
        return [null, 'Error interno al asignar bucket'];
    }
}