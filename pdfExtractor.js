/**
 * Función para extraer datos estructurados del texto de una licencia médica.
 * @param {string} texto - El texto completo extraído del archivo PDF.
 * @returns {object} Un objeto con los datos extraídos de la licencia.
 */
function extraerDatosLicencia(texto) {
    const getMatch = (txt, etiqueta) => {
        const regex = new RegExp(`${etiqueta}\\s*:*\\s*([^\\r\\n]+)`, "i");
        const match = txt.match(regex);
        return match && match[1] ? match[1].trim() : "No encontrado";
    };

    const extractBetween = (txt, startTag, endTag) => {
        const regex = new RegExp(`${startTag}\\s*:*\\s*([\\s\\S]*?)\\s*${endTag}`, "i");
        const match = txt.match(regex);
        if (match && match[1]) {
            return match[1].trim().replace(/[\r\\n]+/g, ' ').replace(/\s+/g, ' ');
        }
        return "No encontrado";
    };

    const direccion = extractBetween(texto, "Dirección Reposo", "Teléfono");
    const telefono = getMatch(texto, "Teléfono");

    let profesional = "No encontrado";
    const profesionalRegex = /Profesional\s*:*\s*([^\r\n]+)/;
    const profesionalMatch = texto.match(profesionalRegex);
    if (profesionalMatch && profesionalMatch[1]) {
        profesional = profesionalMatch[1].trim();
    }

    const datos = {
        folio: getMatch(texto, "Folio Licencia"),
        nombre: getMatch(texto, "Nombre"),
        rut: getMatch(texto, "RUT"),
        edad: getMatch(texto, "Edad"),
        sexo: getMatch(texto, "Sexo"),
        fechaEmision: getMatch(texto, "Fecha de Emisión"),
        inicioReposo: getMatch(texto, "Inicio de Reposo"),
        dias: getMatch(texto, "N° de días"),
        tipoLicencia: getMatch(texto, "Tipo de licencia"),
        fechaTermino: getMatch(texto, "Fecha Termino"),
        profesional: profesional,
        direccion: direccion,
        telefono: telefono,
    };
    
    return datos;
}

module.exports = { extraerDatosLicencia };
