document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.querySelector('#usersTable tbody');
  const createUserForm = document.getElementById('createUserForm');
  const editUserForm = document.getElementById('editUserForm');
  const editUserModalElement = document.getElementById('editUserModal');
  const createUserModalElement = document.getElementById('createUserModal');
  const createRolSelect = document.getElementById('createRol');
  const editRolSelect = document.getElementById('editRol');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const changePasswordModalElement = document.getElementById('changePasswordModal');
  const editUserModal = new bootstrap.Modal(editUserModalElement);
  const createUserModal = new bootstrap.Modal(createUserModalElement);
  const changePasswordModal = new bootstrap.Modal(changePasswordModalElement);

  // Función para validar formato de correo electrónico
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Escuchador de eventos para RUT (números, K, puntos y guiones)
  document.getElementById('createRut').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9Kk.\-]/g, '').toUpperCase();
    if (value.length > 12) value = value.slice(0, 12); // Aumentar límite para incluir puntos y guiones
    e.target.value = value;
  });

  document.getElementById('editRut').addEventListener('input', function(e) {
    let value = e.target.value.replace(/[^0-9Kk.\-]/g, '').toUpperCase();
    if (value.length > 12) value = value.slice(0, 12); // Aumentar límite para incluir puntos y guiones
    e.target.value = value;
  });

  // Función para cargar/recargar la tabla de usuarios y los select de roles
  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('No se pudieron cargar los usuarios ni los roles.');
      }
      const data = await response.json();

      // Rellenar la tabla de usuarios
      usersTableBody.innerHTML = ''; // Limpiar tabla
      data.users.forEach(user => {
        const row = usersTableBody.insertRow();
        row.setAttribute('data-id', user.id);

        // Verificar si este usuario es el mismo que el usuario actual (administrador logueado)
        const isCurrentUser = window.currentUser && user.id === window.currentUser.id;
        
        // Determinar el texto y la clase del botón de desactivar/eliminar
        let actionButton = '';
        if (user.status === 'activo') {
            const deleteButtonDisabled = isCurrentUser ? 'disabled' : '';
            actionButton = `
                <button type="button" class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}" ${deleteButtonDisabled} title="${isCurrentUser ? 'No puedes desactivar tu propia cuenta' : 'Desactivar usuario'}">
                  Desactivar
                </button>
            `;
        } else { // user.status === 'desactivado'
            actionButton = `
                <button type="button" class="btn btn-success btn-sm activate-user-btn" data-id="${user.id}" title="Activar usuario">
                  Activar
                </button>
            `;
        }

        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.rut}</td>
          <td>${user.nombre || '-'}</td>
          <td>${user.apellido || '-'}</td>
          <td>${user.correo || '-'}</td>
          <td>${user['rol.nombre'] || '-'}</td>
          <td>${user.status === 'activo' ? 'Activo' : 'Desactivado'}</td>
          <td>
            <button type="button" class="btn btn-info btn-sm view-qr-btn me-2" data-qr-secret="${user.qr_login_secret || ''}">
              Ver QR
            </button>
            <button type="button" class="btn btn-primary btn-sm edit-user-btn me-2" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#editUserModal">
              Editar
            </button>
            ${actionButton}
          </td>
        `;
      });

      // Rellenar los select de roles
      createRolSelect.innerHTML = '';
      editRolSelect.innerHTML = '';
      data.roles.forEach(rol => {
        const optionCreate = document.createElement('option');
        optionCreate.value = rol.id;
        optionCreate.textContent = rol.nombre;
        createRolSelect.appendChild(optionCreate);

        const optionEdit = document.createElement('option');
        optionEdit.value = rol.id;
        optionEdit.textContent = rol.nombre;
        editRolSelect.appendChild(optionEdit);
      });

    } catch (error) {
      console.error('Error al cargar usuarios y roles:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Enviar formulario de creación de usuario
  if (createUserForm) {
    createUserForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(createUserForm);
      const userData = Object.fromEntries(formData.entries());

      // Validar formato de correo electrónico
      if (!validateEmail(userData.correo)) {
        Swal.fire('Error', 'Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)', 'error');
        return;
      }

      try {
        const response = await fetch('/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire('¡Éxito!', result.message, 'success');
          createUserForm.reset();
          createUserModal.hide();
          loadUsers(); // Recargar la tabla
        } else {
          Swal.fire('Error', result.error || 'Error al crear usuario', 'error');
        }
      } catch (error) {
        console.error('Error al crear usuario:', error);
        Swal.fire('Error', 'Error de conexión al crear usuario', 'error');
      }
    });
  }

  // Llenar modal de edición cuando se abre
  editUserModalElement.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget; // Botón que activó el modal
    const userId = button.getAttribute('data-id');

    try {
      const response = await fetch(`/api/admin/users/${userId}`); // Se modificó para usar la ruta API
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del usuario.');
      }
      const user = await response.json();

      document.getElementById('editUserId').value = user.id;
      document.getElementById('editRut').value = user.rut;
      document.getElementById('editNombre').value = user.nombre || '';
      document.getElementById('editApellido').value = user.apellido || '';
      document.getElementById('editCorreo').value = user.correo || '';
      document.getElementById('editRol').value = user.id_rol; // Seleccionar el rol actual

    } catch (error) {
      console.error('Error al cargar datos del usuario para edición:', error);
      Swal.fire('Error', error.message, 'error');
      editUserModal.hide();
    }
  });

  // Llenar modal de cambiar contraseña cuando se abre
  changePasswordModalElement.addEventListener('show.bs.modal', () => {
    const userId = document.getElementById('editUserId').value;
    document.getElementById('changePasswordUserId').value = userId;
    // Limpiar campos
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
  });

  // Toggle mostrar/ocultar contraseña
  document.addEventListener('click', (event) => {
    if (event.target.closest('.toggle-password')) {
      const button = event.target.closest('.toggle-password');
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = button.querySelector('i');

      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  });

  // Enviar formulario de edición de usuario
  if (editUserForm) {
    editUserForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const userId = document.getElementById('editUserId').value;
      const formData = new FormData(editUserForm);
      const userData = Object.fromEntries(formData.entries());

      // Validar formato de correo electrónico
      if (userData.correo && !validateEmail(userData.correo)) {
        Swal.fire('Error', 'Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)', 'error');
        return;
      }

      // Eliminar el RUT ya que no se puede modificar directamente desde aquí y está deshabilitado en el form
      delete userData.rut;

      try {
        const response = await fetch(`/admin/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire('¡Éxito!', result.message, 'success');
          editUserModal.hide();
          loadUsers(); // Recargar la tabla
        } else {
          Swal.fire('Error', result.error || 'Error al actualizar usuario', 'error');
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        Swal.fire('Error', 'Error de conexión al actualizar usuario', 'error');
      }
    });
  }

  // Enviar formulario de cambiar contraseña
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const userId = document.getElementById('changePasswordUserId').value;
      const oldPassword = document.getElementById('oldPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      // Validar que las nuevas contraseñas coincidan
      if (newPassword !== confirmPassword) {
        Swal.fire('Error', 'Las nuevas contraseñas no coinciden.', 'error');
        return;
      }

      try {
        const response = await fetch(`/admin/users/${userId}/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire('¡Éxito!', result.message, 'success');
          changePasswordModal.hide();
        } else {
          Swal.fire('Error', result.error || 'Error al cambiar contraseña', 'error');
        }
      } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        Swal.fire('Error', 'Error de conexión al cambiar contraseña', 'error');
      }
    });
  }

  // Eliminar (desactivar) y activar usuario
  if (usersTableBody) {
    usersTableBody.addEventListener('click', async (event) => {
      const target = event.target;
      const userId = target.getAttribute('data-id');
      const row = target.closest('tr');
      const userName = row ? row.cells[2].textContent.trim() : 'Usuario';

      if (target.classList.contains('delete-user-btn')) {
        // Lógica para desactivar usuario
        if (window.currentUser && parseInt(userId) === window.currentUser.id) {
          Swal.fire('Acción no permitida', 'No puedes desactivar tu propia cuenta de usuario.', 'warning');
          return;
        }

        Swal.fire({
          title: '¿Estás seguro?',
          text: `Se desactivará al usuario ${userName}. Podrás reactivarlo después.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, desactivar!',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await fetch(`/admin/users/${userId}`, {
                method: 'DELETE',
              });

              const resultData = await response.json();

              if (response.ok) {
                Swal.fire(
                  '¡Desactivado!',
                  resultData.message,
                  'success'
                );
                loadUsers(); // Recargar la tabla
              } else {
                Swal.fire('Error', resultData.error || 'Error al desactivar usuario', 'error');
              }
            } catch (error) {
              console.error('Error al desactivar usuario:', error);
              Swal.fire('Error', 'Error de conexión al desactivar usuario', 'error');
            }
          }
        });
      } else if (target.classList.contains('activate-user-btn')) {
        // Lógica para activar usuario
        Swal.fire({
          title: '¿Estás seguro?',
          text: `Se activará al usuario ${userName}.`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#28a745',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, activar!',
          cancelButtonText: 'Cancelar'
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await fetch(`/admin/users/${userId}/activate`, {
                method: 'PUT',
              });

              const resultData = await response.json();

              if (response.ok) {
                Swal.fire(
                  '¡Activado!',
                  resultData.message,
                  'success'
                );
                loadUsers(); // Recargar la tabla
              } else {
                Swal.fire('Error', resultData.error || 'Error al activar usuario', 'error');
              }
            } catch (error) {
              console.error('Error al activar usuario:', error);
              Swal.fire('Error', 'Error de conexión al activar usuario', 'error');
            }
          }
        });
      }
    });
  }

  // Cargar usuarios al iniciar la página
  loadUsers();
});
