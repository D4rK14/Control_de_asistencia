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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo })
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

  async function cargarMisAsistencias(id) {
    try {
      const response = await fetch(`/asistencia/mis-asistencias/${id}`);
      const asistencias = await response.json();
      const tableBody = document.querySelector('#asistenciasTable tbody');
      tableBody.innerHTML = '';

      asistencias.forEach(a => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = a.fecha;
        row.insertCell().textContent = a.hora_entrada;
        row.insertCell().textContent = a.hora_salida || '-';
        row.insertCell().textContent = a.tipo_asistencia;
        const justCell = row.insertCell();
        justCell.innerHTML = a.documento && a.documento !== '-' ? `<a href="${a.documento}" target="_blank">Ver</a>` : '-';
      });
    } catch (error) {
      console.error('Error al cargar asistencias:', error);
      notificationModalBody.innerHTML = '<div class="alert alert-danger">Error al cargar los reportes de asistencia.</div>';
      notificationModal.show();
    }
  }

  cargarMisAsistencias(usuarioId);
});