// Archivo: controllers/justificationController.js
/**
 * @file justificationController.js
 * @description Controlador para listar y actualizar el estado de justificaciones comunes.
 */

const Justificacion = require('../models/justification');
const User = require('../models/User');

/**
 * Renderiza la vista de administración de justificaciones.
 */
const renderAdminJustifications = async (req, res) => {
    try {
        res.render('admin/justificaciones');
    } catch (error) {
        console.error('Error al renderizar la vista de justificaciones:', error);
        res.status(500).render('common/dashboard_error', { message: 'Error al cargar justificaciones.' });
    }
};

/**
 * Devuelve todas las justificaciones con datos de usuario.
 */
const getAllJustifications = async (req, res) => {
    try {
        const justificaciones = await Justificacion.findAll({
            include: [{ model: User, as: 'usuario', attributes: ['id', 'rut', 'nombre', 'apellido', 'correo'] }],
            order: [['fecha_solicitud', 'DESC']]
        });
        const plain = justificaciones.map(j => j.toJSON());
        res.json({ justificaciones: plain });
    } catch (error) {
        console.error('Error al obtener justificaciones:', error);
        res.status(500).json({ error: 'Error al obtener justificaciones.' });
    }
};

/**
 * Actualiza el estado de una justificación.
 */
const updateJustificationStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['Pendiente', 'Aprobada', 'Rechazada'];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido.' });
    }

    try {
        const justificacion = await Justificacion.findByPk(id);
        if (!justificacion) {
            return res.status(404).json({ error: 'Justificación no encontrada.' });
        }
        justificacion.estado = estado;
        await justificacion.save();
        res.json({ message: 'Estado actualizado correctamente.', justificacion });
    } catch (error) {
        console.error('Error al actualizar estado de justificación:', error);
        res.status(500).json({ error: 'Error al actualizar el estado.' });
    }
};

module.exports = {
    renderAdminJustifications,
    getAllJustifications,
    updateJustificationStatus
};


