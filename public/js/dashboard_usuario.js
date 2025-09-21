document.addEventListener('DOMContentLoaded', () => {
  const asistenciaForm = document.getElementById('asistenciaForm');
  const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
  const notificationModalBody = document.getElementById('notificationModalBody');

  if (asistenciaForm) {
    asistenciaForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const tipo = event.submitter.value;

      try {
        const response = await fetch(`/asistencia/${usuarioId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tipo }),
        });

        const data = await response.json();

        if (response.ok) {
          notificationModalBody.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
          cargarMisAsistencias(usuarioId);
        } else {
          notificationModalBody.innerHTML = `<div class="alert alert-danger">${data.error || 'Error al registrar asistencia.'}</div>`;
        }
      } catch (error) {
        console.error('Error en la petición de asistencia:', error);
        notificationModalBody.innerHTML = '<div class="alert alert-danger">Error de conexión con el servidor.</div>';
      } finally {
        notificationModal.show();
      }
    });
  }

  // Cargar asistencias del usuario
  async function cargarMisAsistencias(id) {
    try {
      const response = await fetch(`/asistencia/mis-asistencias/${id}`);
      const asistencias = await response.json();
      const tableBody = document.querySelector('#asistenciasTable tbody');
      tableBody.innerHTML = '';

      asistencias.forEach(asistencia => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = asistencia.fecha;
        row.insertCell().textContent = asistencia.hora_entrada;
        row.insertCell().textContent = asistencia.hora_salida || '-';
        row.insertCell().textContent = asistencia.estado ? asistencia.estado.nombre : '-';
        const justificacionCell = row.insertCell();
        if (asistencia.documento) {
          justificacionCell.innerHTML = `<a href="${asistencia.documento}" target="_blank">Ver</a>`;
        } else {
          justificacionCell.textContent = '-';
        }
      });
    } catch (error) {
      console.error('Error al cargar las asistencias:', error);
      notificationModalBody.innerHTML = '<div class="alert alert-danger">Error al cargar los reportes de asistencia.</div>';
      notificationModal.show();
    }
  }

  cargarMisAsistencias(usuarioId);
});