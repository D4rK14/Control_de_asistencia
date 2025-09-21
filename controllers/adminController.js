// Archivo: controllers/adminController.js
/**
 * @file adminController.js
 * @description Controlador para manejar las operaciones administrativas relacionadas con los usuarios,
 * incluyendo la visualización, creación, actualización y eliminación de usuarios (CRUD).
 * Este controlador está diseñado para ser accedido únicamente por usuarios con rol de 'Administrador'.
 */

const User = require('../models/User'); // Importa el modelo User para interactuar con la tabla de usuarios.
const Rol = require('../models/Rol');   // Importa el modelo Rol para poder asociar usuarios a roles y mostrarlos.
const bcrypt = require('bcryptjs');     // Importa bcryptjs para encriptar contraseñas de forma segura.

/**
 * @function _fetchUsersAndRolesData
 * @description Función interna para obtener la lista de todos los usuarios y roles de la base de datos.
 * Esta función está diseñada para ser reutilizada por otros controladores sin enviar una respuesta HTTP directamente.
 * @returns {Promise<Object>} Un objeto que contiene un arreglo de usuarios y un arreglo de roles.
 * @throws {Error} Si hay un problema al obtener los datos de la base de datos.
 */
const _fetchUsersAndRolesData = async () => {
    try {
        const users = await User.findAll({
            include: [{ model: Rol, as: 'rol' }],
            raw: true
        });
        const roles = await Rol.findAll({ raw: true });
        return { users, roles };
    } catch (error) {
        console.error("Error al obtener usuarios y roles de la base de datos:", error);
        throw new Error("Error al obtener datos de usuarios y roles.");
    }
};

/**
 * @function renderAdminUserDashboard
 * @description Renderiza la vista del dashboard de administración de usuarios (CRUD).
 * Esta función es responsable de mostrar la página HTML que contiene la tabla de usuarios y los formularios de gestión.
 * Los datos iniciales de usuarios y roles se cargan mediante una llamada API separada en el frontend.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Renderiza la plantilla `admin/userCRUD.hbs`.
 */
const renderAdminUserDashboard = async (req, res) => {
    try {
        // Aquí ya no necesitamos cargar los usuarios y roles, solo renderizamos la vista.
        // Los datos se cargarán dinámicamente en el frontend a través de la ruta /api/admin/users.
        res.render('admin/userCRUD', {
            // Si necesitas pasar alguna variable global o de sesión a la vista, hazlo aquí.
            // Por ejemplo, para mostrar el nombre del administrador logeado.
            user: req.user // El usuario autenticado (administrador) puede ser útil en la vista.
        });
    } catch (error) {
        console.error("Error al renderizar el dashboard de administración de usuarios:", error);
        res.status(500).render('common/dashboard_error', { message: "Error al cargar la gestión de usuarios." });
    }
};

/**
 * @function getUsersAndRoles
 * @description Obtiene y devuelve una lista de todos los usuarios y roles en formato JSON.
 * Esta función es una API endpoint y está diseñada para ser consumida por el frontend
 * para cargar dinámicamente los datos en la tabla del CRUD de usuarios.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con la lista de usuarios y roles, o un mensaje de error.
 */
const getUsersAndRoles = async (req, res) => {
    try {
        const { users, roles } = await _fetchUsersAndRolesData(); // Usa la función interna
        res.json({ users, roles });
    } catch (error) {
        console.error("Error al obtener usuarios y roles (API):", error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios y roles.', details: error.message });
    }
};

/**
 * @function getUserById
 * @description Obtiene los datos de un usuario específico por su ID.
 * Esta función es una API endpoint para ser consumida por el frontend
 * para rellenar los formularios de edición de usuario.
 * @param {Object} req - Objeto de solicitud de Express. Espera `id` en `req.params`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con el usuario encontrado o un mensaje de error.
 */
const getUserById = async (req, res) => {
    const { id } = req.params; // ID del usuario a buscar.
    try {
        const user = await User.findByPk(id, {
            include: [{ model: Rol, as: 'rol' }], // Incluye la información de su rol.
            raw: true // Devuelve un objeto plano de JavaScript.
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(user); // Envía los datos del usuario en formato JSON.
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ error: 'Error al obtener la información del usuario.', details: error.message });
    }
};

/**
 * @function createUser
 * @description Crea un nuevo usuario en la base de datos.
 * Requiere un RUT, nombre, apellido, correo, contraseña y `id_rol` en el cuerpo de la petición.
 * La contraseña se encripta antes de ser almacenada.
 * @param {Object} req - Objeto de solicitud de Express. Espera los datos del nuevo usuario en `req.body`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con el nuevo usuario o un mensaje de error.
 */
const createUser = async (req, res) => {
    const { rut, nombre, apellido, correo, password, id_rol } = req.body;
    try {
        // Encripta la contraseña antes de guardar el usuario.
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea el nuevo usuario en la base de datos.
        const newUser = await User.create({
            rut,
            nombre,
            apellido,
            correo,
            password: hashedPassword,
            id_rol
        });
        res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: 'Error al crear el usuario.', details: error.message });
    }
};

/**
 * @function updateUser
 * @description Actualiza la información de un usuario existente en la base de datos.
 * Requiere el ID del usuario en los parámetros de la URL y los datos a actualizar en el cuerpo de la petición.
 * Si se actualiza la contraseña, esta se encripta nuevamente.
 * @param {Object} req - Objeto de solicitud de Express. Espera `id` en `req.params` y datos en `req.body`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON con el usuario actualizado o un mensaje de error.
 */
const updateUser = async (req, res) => {
    const { id } = req.params; // ID del usuario a actualizar.
    const { nombre, apellido, correo, password, id_rol } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Actualiza solo los campos proporcionados.
        user.nombre = nombre || user.nombre;
        user.apellido = apellido || user.apellido;
        user.correo = correo || user.correo;
        user.id_rol = id_rol || user.id_rol;

        // Si se proporciona una nueva contraseña, encriptarla.
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save(); // Guarda los cambios en la base de datos.
        res.json({ message: 'Usuario actualizado con éxito', user });
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ error: 'Error al actualizar el usuario.', details: error.message });
    }
};

/**
 * @function deleteUser
 * @description Elimina un usuario de la base de datos.
 * Requiere el ID del usuario en los parámetros de la URL.
 * @param {Object} req - Objeto de solicitud de Express. Espera `id` en `req.params`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON indicando el éxito o el fracaso de la eliminación.
 */
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar que el usuario no esté intentando eliminarse a sí mismo
        if (req.user && parseInt(id) === req.user.id) {
            return res.status(403).json({ error: 'No puedes eliminar tu propia cuenta de usuario.' });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        await user.destroy(); // Elimina el usuario de la base de datos.
        res.json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ error: 'Error al eliminar el usuario.', details: error.message });
    }
};

/**
 * @function changePassword
 * @description Cambia la contraseña de un usuario existente, verificando primero la contraseña antigua.
 * Requiere el ID del usuario en los parámetros de la URL y oldPassword, newPassword en el cuerpo.
 * @param {Object} req - Objeto de solicitud de Express. Espera `id` en `req.params` y `oldPassword`, `newPassword` en `req.body`.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Envía una respuesta JSON indicando el éxito o el fracaso del cambio de contraseña.
 */
const changePassword = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verificar la contraseña antigua
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'La contraseña antigua es incorrecta.' });
        }

        // Encriptar la nueva contraseña
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Contraseña cambiada con éxito.' });
    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({ error: 'Error al cambiar la contraseña.', details: error.message });
    }
};

// Exporta todas las funciones del controlador para que puedan ser utilizadas por las rutas de Express.
module.exports = {
    renderAdminUserDashboard,
    getUsersAndRoles,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changePassword,
    _fetchUsersAndRolesData // Exporta la función interna para que otros controladores puedan usarla.
};
