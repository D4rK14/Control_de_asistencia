document.addEventListener('DOMContentLoaded', () => {
  const asistenciaForm = document.getElementById('asistenciaForm');
  const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
  const notificationModalBody = document.getElementById('notificationModalBody');

  if (asistenciaForm) {
    asistenciaForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const tipo = event.submitter.value;

      try {
        const response = await fetch(`/asistencia/registrar/${usuarioId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tipo })
        });

        const data = await response.json();

        if (response.ok) {
          notificationModalBody.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
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

});