document.addEventListener('DOMContentLoaded', () => {
  const asistenciaForm = document.getElementById('asistenciaForm');
  const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
  const notificationModalBody = document.getElementById('notificationModalBody');
  const usuarioId = window.usuarioId; // Obtener el ID del usuario de la variable global

  if (asistenciaForm) {
    asistenciaForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevenir el envío por defecto del formulario

      const formData = new FormData(asistenciaForm);
      const tipo = event.submitter.value; // Obtener el valor del botón presionado (entrada/salida)

      try {
        const response = await fetch(`/asistencia/${usuarioId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tipo: tipo }),
        });

        const data = await response.json();

        if (response.ok) {
          notificationModalBody.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
          // Recargar la tabla de asistencias
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

  // Función para cargar las asistencias del usuario
  async function cargarMisAsistencias(id) {
    try {
      const response = await fetch(`/asistencia/mis-asistencias/${id}`);
      const asistencias = await response.json();
      const tableBody = document.querySelector('#asistenciasTable tbody');
      tableBody.innerHTML = ''; // Limpiar tabla actual

      asistencias.forEach(asistencia => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = asistencia.fecha;
        row.insertCell().textContent = asistencia.hora_entrada;
        row.insertCell().textContent = asistencia.hora_salida || '-';
        row.insertCell().textContent = asistencia.tipo_asistencia || '-'; // Usar el alias tipo_asistencia
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

  // Cargar asistencias al iniciar la página
  cargarMisAsistencias(usuarioId);
});
