document.addEventListener('DOMContentLoaded', () => {
    const inputLicencia = document.getElementById('archivo-licencia');
    const resultadosDiv = document.getElementById('resultados-licencia');
    const spinner = document.getElementById('spinner');
    const enviarLicenciaBtn = document.getElementById('enviar-licencia-btn');
    const idUsuarioInput = document.getElementById('id-usuario');

    let archivoPdfSeleccionado = null; // Variable para almacenar el archivo PDF
    let datosExtraidosGlobal = null; // Variable para almacenar los datos extraídos

    if (inputLicencia) { // Solo ejecutar si el input existe en la página actual
        inputLicencia.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            archivoPdfSeleccionado = file; // Almacena el archivo seleccionado
            if (file && file.type === 'application/pdf') {
                resultadosDiv.style.display = 'none';
                spinner.style.display = 'block';
                enviarLicenciaBtn.disabled = true; // Deshabilita el botón mientras se procesa

                try {
                    const fileReader = new FileReader();
                    fileReader.onload = async function() {
                        const typedarray = new Uint8Array(this.result);
                        const pdf = await pdfjsLib.getDocument(typedarray).promise;
                        let textoCompleto = '';

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            textoCompleto += pageText + '\n';
                        }

                        // Usamos la función de pdfExtractor.js
                        const datos = extraerDatosLicencia(textoCompleto);
                        datosExtraidosGlobal = datos; // Almacena los datos extraídos globalmente
                        
                        document.getElementById('folio').textContent = datos.folio;
                        document.getElementById('nombre').textContent = datos.nombre;
                        document.getElementById('rut').textContent = datos.rut;
                        document.getElementById('edad').textContent = datos.edad;
                        document.getElementById('sexo').textContent = datos.sexo;
                        document.getElementById('tipoLicencia').textContent = datos.tipoLicencia;
                        document.getElementById('fechaEmision').textContent = datos.fechaEmision;
                        document.getElementById('inicioReposo').textContent = datos.inicioReposo;
                        document.getElementById('fechaTermino').textContent = datos.fechaTermino;
                        document.getElementById('dias').textContent = datos.dias;
                        document.getElementById('profesional').textContent = datos.profesional;
                        document.getElementById('telefono').textContent = datos.telefono;
                        document.getElementById('direccion').textContent = datos.direccion;

                        spinner.style.display = 'none';
                        resultadosDiv.style.display = 'block';
                        enviarLicenciaBtn.disabled = false; // Habilita el botón
                    };
                    fileReader.readAsArrayBuffer(file);
                } catch (error) {
                    console.error('Error al procesar el PDF:', error);
                    spinner.style.display = 'none';
                    enviarLicenciaBtn.disabled = true; // Mantén el botón deshabilitado si hay un error
                    alert('Hubo un error al procesar el archivo PDF. Asegúrate de que sea un archivo válido.');
                }
            }
        });
    }

    // Event listener para el botón de enviar licencia
    if (enviarLicenciaBtn) {
        enviarLicenciaBtn.addEventListener('click', async (event) => {
            event.preventDefault(); // Evita el envío del formulario tradicional

            if (!archivoPdfSeleccionado || !datosExtraidosGlobal || !idUsuarioInput.value) {
                alert('Por favor, primero carga un PDF y asegúrate de que se hayan extraído los datos y el ID de usuario esté disponible.');
                return;
            }

            const formData = new FormData();
            formData.append('archivoLicencia', archivoPdfSeleccionado); // 'archivoLicencia' debe coincidir con el nombre esperado en Multer
            formData.append('id_usuario', idUsuarioInput.value);

            // Añadir todos los datos extraídos al formData
            for (const key in datosExtraidosGlobal) {
                // Asegúrate de que los nombres de las claves coincidan con los del modelo si es necesario.
                // Aquí hago una pequeña adaptación para que coincidan con los nombres del modelo.
                let fieldName = key;
                if (key === 'nombre') fieldName = 'nombre_trabajador';
                else if (key === 'rut') fieldName = 'rut_trabajador';
                else if (key === 'edad') fieldName = 'edad_trabajador';
                else if (key === 'sexo') fieldName = 'sexo_trabajador';
                else if (key === 'direccion') fieldName = 'direccion_reposo';
                else if (key === 'telefono') fieldName = 'telefono_contacto';
                else if (key === 'fechaEmision') fieldName = 'fecha_emision';
                else if (key === 'inicioReposo') fieldName = 'fech-inicio'; // Corregido
                else if (key === 'fechaTermino') fieldName = 'fecha_fin';
                else if (key === 'dias') fieldName = 'dias_reposo';
                else if (key === 'tipoLicencia') fieldName = 'tipo_licencia';
                else if (key === 'profesional') fieldName = 'profesional'; // Ya coincide

                formData.append(fieldName, datosExtraidosGlobal[key]);
            }

            // Mostrar spinner y deshabilitar botón
            spinner.style.display = 'block';
            resultadosDiv.style.display = 'none';
            enviarLicenciaBtn.disabled = true;

            try {
                const response = await fetch('/api/licenses', {
                    method: 'POST',
                    body: formData // No establecer Content-Type, fetch lo hace automáticamente con FormData
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    // Opcional: limpiar formulario o redirigir
                    window.location.href = '/dashboard_usuario'; // Ejemplo de redirección
                } else {
                    alert(`Error: ${result.error || 'No se pudo crear la licencia.'}`);
                }
            } catch (error) {
                console.error('Error al enviar licencia:', error);
                alert('Hubo un error de red o de servidor al intentar enviar la licencia.');
            } finally {
                spinner.style.display = 'none';
                enviarLicenciaBtn.disabled = false;
                resultadosDiv.style.display = 'block'; // Mostrar resultados nuevamente si no se redirige
            }
        });
    }
});
