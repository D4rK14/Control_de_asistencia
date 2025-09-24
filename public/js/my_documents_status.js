document.addEventListener('DOMContentLoaded', async () => {
    const documentTypeFilter = document.getElementById('documentTypeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const myDocumentsTableBody = document.querySelector('#myDocumentsTable tbody');

    let allDocuments = []; // Almacenará todas las justificaciones y licencias del usuario

    // Función para formatear fechas a un formato legible
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    // Función para cargar todos los documentos del usuario (justificaciones y licencias)
    async function fetchMyDocuments() {
        try {
            const [justificacionesRes, licenciasRes] = await Promise.all([
                fetch('/api/user/justificaciones', { credentials: 'include' }),
                fetch('/api/user/licencias', { credentials: 'include' })
            ]);

            if (!justificacionesRes.ok) throw new Error('Error al cargar justificaciones');
            if (!licenciasRes.ok) throw new Error('Error al cargar licencias');

            const justificacionesData = await justificacionesRes.json();
            const licenciasData = await licenciasRes.json();

            // Logs para depuración
            console.log("Respuesta Justificaciones:", justificacionesData);
            console.log("Respuesta Licencias:", licenciasData);

            // Formatear justificaciones
            const formattedJustificaciones = (justificacionesData.justificaciones || []).map(j => ({
                id: j.id,
                type: 'justification',
                typeDisplay: 'Justificación',
                motiveOrProfessional: j.motivo,
                startDate: formatDate(j.fecha_inicio),
                endDate: formatDate(j.fecha_fin),
                status: j.estado,
                file: j.archivo ? `/uploads/${j.archivo}` : null // Asumiendo que los archivos están en /uploads
            }));

            // Formatear licencias
            const formattedLicencias = (licenciasData.licencias || []).map(l => ({
                id: l.id,
                type: 'license',
                typeDisplay: 'Licencia Médica',
                motiveOrProfessional: l.profesional,
                startDate: formatDate(l.fecha_inicio),
                endDate: formatDate(l.fecha_fin),
                status: l.estado,
                file: l.archivo ? `/uploads/${l.id_usuario}/${l.archivo}` : null // Asumiendo estructura de /uploads/<userId>/<filename>
            }));

            allDocuments = [...formattedJustificaciones, ...formattedLicencias];
            renderDocuments(allDocuments); // Renderizar inicialmente todos los documentos
        } catch (error) {
            console.error('Error al obtener documentos del usuario:', error);
            Swal.fire('Error', 'No se pudieron cargar tus documentos.', 'error');
        }
    }

    // Función para renderizar los documentos en la tabla
    function renderDocuments(documentsToRender) {
        myDocumentsTableBody.innerHTML = ''; // Limpiar tabla
        if (documentsToRender.length === 0) {
            myDocumentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay documentos para mostrar.</td></tr>';
            return;
        }

        documentsToRender.forEach(doc => {
            const row = myDocumentsTableBody.insertRow();
            row.innerHTML = `
                <td>${doc.typeDisplay}</td>
                <td>${doc.motiveOrProfessional || '-'}</td>
                <td>${doc.startDate} - ${doc.endDate}</td>
                <td><span class="badge bg-${getStatusBadgeClass(doc.status)}">${doc.status}</span></td>
                <td>
                    ${doc.file ? `<a href="${doc.file}" target="_blank" class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-file-arrow-down"></i> Ver Archivo</a>` : '-'}
                </td>
            `;
        });
    }

    // Función auxiliar para clases de badges de estado
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'Aprobada': return 'success';
            case 'Rechazada': return 'danger';
            case 'Pendiente': return 'warning';
            default: return 'secondary';
        }
    }

    // Función para aplicar filtros
    function applyFilters() {
        const selectedDocType = documentTypeFilter.value;
        const selectedStatus = statusFilter.value;

        let filteredDocuments = allDocuments;

        if (selectedDocType !== 'all') {
            filteredDocuments = filteredDocuments.filter(doc => doc.type === selectedDocType);
        }

        if (selectedStatus !== 'all') {
            filteredDocuments = filteredDocuments.filter(doc => doc.status === selectedStatus);
        }

        renderDocuments(filteredDocuments);
    }

    // Event Listeners
    applyFiltersBtn.addEventListener('click', applyFilters);

    // Cargar documentos al iniciar la página
    fetchMyDocuments();
});
