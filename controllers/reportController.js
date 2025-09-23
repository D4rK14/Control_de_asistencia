// controllers/reportController.js

const { Op } = require('sequelize');
const moment = require('moment-timezone');
const Asistencia = require('../models/assist');
const User = require('../models/User');
const EstadoAsistencia = require('../models/StateAssist');
const CategoriaAsistencia = require('../models/assistCategory');
const Rol = require('../models/Rol'); // Needed to get user roles

const getAbsenceReports = async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').startOf('day').toDate();
        const filterType = req.query.filterType || ''; // 'inasistencia', 'atraso', 'salida_anticipada', 'ambas'
        const whereClause = { fecha: { [Op.gte]: sevenDaysAgo } };

        if (filterType) {
            let categoryIds = [];
            // Fetch category IDs dynamically
            const categories = await CategoriaAsistencia.findAll({ attributes: ['id', 'nombre'] });
            const inasistenciaCategory = categories.find(cat => cat.nombre === 'Inasistencia');
            const atrasoCategory = categories.find(cat => cat.nombre === 'Atraso');
            // Assuming 'Salida Anticipada' would also have a category or state ID if it existed as such.

            if (filterType === 'inasistencia' && inasistenciaCategory) {
                categoryIds.push(inasistenciaCategory.id);
            } else if (filterType === 'atraso' && atrasoCategory) {
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'ambas' && inasistenciaCategory && atrasoCategory) {
                // This scenario means both atraso AND inasistencia. This is not clear, will assume OR for now
                // and will refine based on user feedback if necessary for 'both'.
                // For 'ambas' (atraso y salida temprana), it implies an additional category or logic.
                // For simplicity, for 'ambas' filtering 'atraso' and 'inasistencia' at the same time
                // is not straightforward with a single category filter.
                // I'll adjust the logic for 'ambas' to be a combination of inasistencia or atraso for now.
                categoryIds.push(inasistenciaCategory.id);
                categoryIds.push(atrasoCategory.id);
            } else if (filterType === 'salida_anticipada') {
                // Placeholder for 'Salida Anticipada' logic
                // This would require comparing hora_salida with a standard work end time.
                // For now, no specific filter is applied here, it will be handled on the frontend if needed for display.
                console.log('Filtro de Salida Anticipada solicitado, pero no implementado en el backend por falta de definición de horario estándar.');
            }
            if (categoryIds.length > 0) {
                whereClause.id_categoria = { [Op.in]: categoryIds };
            }
        }

        const reports = await Asistencia.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'usuario',
                    attributes: ['nombre', 'apellido', 'rut'],
                    include: [{
                        model: Rol,
                        as: 'rol',
                        attributes: ['nombre']
                    }]
                },
                {
                    model: EstadoAsistencia,
                    as: 'estado',
                    attributes: ['estado']
                },
                {
                    model: CategoriaAsistencia,
                    as: 'categoria',
                    attributes: ['nombre']
                }
            ],
            order: [['fecha', 'DESC'], ['hora_entrada', 'ASC']]
        });

        const formattedReports = reports.map(report => ({
            id: report.id,
            fecha: moment(report.fecha).format('YYYY-MM-DD'),
            hora_entrada: report.hora_entrada ? moment(report.hora_entrada, 'HH:mm:ss').format('HH:mm') : 'N/A',
            hora_salida: report.hora_salida ? moment(report.hora_salida, 'HH:mm:ss').format('HH:mm') : 'N/A',
            estado: report.estado ? report.estado.estado : 'N/A',
            categoria: report.categoria ? report.categoria.nombre : 'N/A',
            usuario_nombre: report.usuario ? `${report.usuario.nombre} ${report.usuario.apellido}` : 'N/A',
            usuario_rut: report.usuario ? report.usuario.rut : 'N/A',
            usuario_rol: report.usuario && report.usuario.rol ? report.usuario.rol.nombre : 'N/A',
        }));

        res.render('reports/absenceReports', {
            pageTitle: 'Reportes de Asistencia por Empleado',
            reports: formattedReports,
            selectedFilter: filterType // Para mantener el filtro seleccionado en la vista
        });
    } catch (error) {
        console.error('Error al obtener reportes de asistencia:', error);
        res.status(500).render('common/dashboard_error', {
            pageTitle: 'Error',
            message: 'No se pudieron cargar los reportes de asistencia.',
            error: error.message,
        });
    }
};

module.exports = {
    getAbsenceReports,
};
