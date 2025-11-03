const PALABRAS_PROHIBIDAS = [
    'weon', 'weón', 'wea', 'weá', 'ctm', 'csm', 'ctmare', 'chucha', 'chuchetumare',
    'concha', 'conchetumare', 'pico', 'pichula', 'zorra', 'perra', 'puta', 'put@',
    'imbecil', 'imbécil', 'idiota', 'estupido', 'estúpido', 'mierda', 'caca',
    'qliao', 'culiao', 'culiado', 'qlo', 'culo', 'aweonao', 'aweonado',
    'maricon', 'maricón', 'marica', 'joto', 'gay', 'trolo',
    'pendejo', 'huevon', 'huevón', 'pelotudo', 'boludo',
    'mrd', 'mrda', 'verga', 'polla', 'cagar', 'cag@r',
    'chingar', 'joder', 'coger', 'cogida', 'chupalo', 'chúpalo',
    'w30n', 'w3on', 'cu1i@o', 'put4', 'm13rd4', 'c4c4',
    'fuck', 'shit', 'bitch', 'ass', 'bastard', 'damn', 'hell',
    'dick', 'cock', 'pussy', 'whore', 'slut', 'nigger', 'fag',
    'viagra', 'casino', 'porn', 'xxx', 'sex', 'sexo',
];

const PATRONES_PROHIBIDOS = [
    /w[e3@]([o0]|ó)n/gi,           // weon, w3on, weón, etc
    /w[e3@][a@]/gi,                 // wea, w3a, we@, etc
    /c[o0@]nch[a@]/gi,              // concha y variaciones
    /p[i1!]c[o0@]/gi,               // pico y variaciones
    /m[i1!][e3@]rd[a@]/gi,          // mierda y variaciones
    /p[u@][t+][a@o]/gi,             // puta, puto y variaciones
    /q[l1][i1!][a@][o0]/gi,         // qliao y variaciones
    /c[u@][l1][i1!][a@][o0]/gi,     // culiao y variaciones
    /f[u@]ck/gi,                    // fuck y variaciones
    /sh[i1!]t/gi,                   // shit y variaciones
    /[a@]ss\s*h[o0]l[e3]/gi,        // asshole y variaciones
];

function normalizarTexto(texto) {
    if (!texto || typeof texto !== 'string') return '';
    
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') 
        .replace(/[^a-z0-9\s]/g, '');    
}

function contienePalabrasProhibidas(texto) {
    if (!texto || typeof texto !== 'string') {
        return { contienePalabrasProhibidas: false, palabrasEncontradas: [] };
    }

    const palabrasEncontradas = new Set();
    const textoNormalizado = normalizarTexto(texto);
    
    PALABRAS_PROHIBIDAS.forEach(palabra => {
        const palabraNormalizada = normalizarTexto(palabra);
        // Buscar como palabra completa (con límites de palabra)
        const regex = new RegExp(`\\b${palabraNormalizada}\\b`, 'gi');
        if (regex.test(textoNormalizado)) {
            palabrasEncontradas.add(palabra);
        }
    });

    // Verificar patrones regex
    PATRONES_PROHIBIDOS.forEach(patron => {
        const matches = texto.match(patron);
        if (matches) {
            matches.forEach(match => palabrasEncontradas.add(match));
        }
    });

    return {
        contienePalabrasProhibidas: palabrasEncontradas.size > 0,
        palabrasEncontradas: Array.from(palabrasEncontradas)
    };
}

export function validarContenidoObjeto(obj, camposAValidar = null) {
    if (!obj || typeof obj !== 'object') {
        return { esValido: true, camposConProblemas: {} };
    }

    const camposConProblemas = {};
    const campos = camposAValidar || Object.keys(obj);

    campos.forEach(campo => {
        const valor = obj[campo];
        
        if (typeof valor === 'string') {
            const resultado = contienePalabrasProhibidas(valor);
            if (resultado.contienePalabrasProhibidas) {
                camposConProblemas[campo] = {
                    valor: valor,
                    palabrasProhibidas: resultado.palabrasEncontradas
                };
            }
        }
        
        if (Array.isArray(valor)) {
            valor.forEach((item, index) => {
                if (typeof item === 'string') {
                    const resultado = contienePalabrasProhibidas(item);
                    if (resultado.contienePalabrasProhibidas) {
                        const clave = `${campo}[${index}]`;
                        camposConProblemas[clave] = {
                            valor: item,
                            palabrasProhibidas: resultado.palabrasEncontradas
                        };
                    }
                }
            });
        }
    });

    return {
        esValido: Object.keys(camposConProblemas).length === 0,
        camposConProblemas
    };
}
