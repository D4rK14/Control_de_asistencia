document.addEventListener('DOMContentLoaded', () => {
  const usersTableBody = document.querySelector('#usersTable tbody');
  const createUserForm = document.getElementById('createUserForm');
  const editUserForm = document.getElementById('editUserForm');
  const editUserModalElement = document.getElementById('editUserModal');
  const createUserModalElement = document.getElementById('createUserModal');
  const createRolSelect = document.getElementById('createRol');
  const editRolSelect = document.getElementById('editRol');
  const editUserModal = new bootstrap.Modal(editUserModalElement);
  const createUserModal = new bootstrap.Modal(createUserModalElement);

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
        row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.rut}</td>
          <td>${user.nombre || '-'}</td>
          <td>${user.apellido || '-'}</td>
          <td>${user.correo || '-'}</td>
          <td>${user['rol.nombre'] || '-'}</td> <!-- Se modificó para acceder directamente a 'rol.nombre' -->
          <td>
            <button type="button" class="btn btn-primary btn-sm edit-user-btn" data-id="${user.id}" data-bs-toggle="modal" data-bs-target="#editUserModal">
              Editar
            </button>
            <button type="button" class="btn btn-danger btn-sm delete-user-btn" data-id="${user.id}">
              Eliminar
            </button>
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
      document.getElementById('editPassword').value = ''; // Limpiar campo de contraseña

    } catch (error) {
      console.error('Error al cargar datos del usuario para edición:', error);
      Swal.fire('Error', error.message, 'error');
      editUserModal.hide();
    }
  });

  // Enviar formulario de edición de usuario
  if (editUserForm) {
    editUserForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const userId = document.getElementById('editUserId').value;
      const formData = new FormData(editUserForm);
      const userData = Object.fromEntries(formData.entries());

      // Eliminar el RUT ya que no se puede modificar directamente desde aquí y está deshabilitado en el form
      delete userData.rut;
      // Si la contraseña está vacía, no enviarla para que no se actualice
      if (userData.password === '') {
        delete userData.password;
      }

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

  // Eliminar usuario
  if (usersTableBody) {
    usersTableBody.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete-user-btn')) {
        const userId = event.target.getAttribute('data-id');

        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminarlo!',
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
                  '¡Eliminado!',
                  resultData.message,
                  'success'
                );
                loadUsers(); // Recargar la tabla
              } else {
                Swal.fire('Error', resultData.error || 'Error al eliminar usuario', 'error');
              }
            } catch (error) {
              console.error('Error al eliminar usuario:', error);
              Swal.fire('Error', 'Error de conexión al eliminar usuario', 'error');
            }
          }
        });
      }
    });
  }

  // Cargar usuarios al iniciar la página
  loadUsers();
});
