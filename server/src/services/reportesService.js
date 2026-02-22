const materiasRepository = require('../repositories/materiasRepository');
const tareasRepository = require('../repositories/tareasRepository');
const examenesRepository = require('../repositories/examenesRepository');
const apuntesRepository = require('../repositories/apuntesRepository');

class ReportesService {
  async getReporteGeneral(usuarioId) {
    const [materias, tareas, examenes, apuntes] = await Promise.all([
      materiasRepository.findAll(usuarioId),
      tareasRepository.findAll(usuarioId),
      examenesRepository.findAll(usuarioId),
      apuntesRepository.findAll(usuarioId),
    ]);

    const materiasActivas = materias.filter(m => m.estado === 'Activa');
    const promedioGeneral = materiasActivas.length
      ? materiasActivas.reduce((sum, m) => sum + (m.nota || 0), 0) / materiasActivas.length
      : 0;

    const tareasCompletadas = tareas.filter(t => t.estado === 'Completada').length;
    const examenesConNota = examenes.filter(e => e.nota !== null).length;

    return {
      resumen: {
        totalMaterias: materias.length,
        materiasActivas: materiasActivas.length,
        promedioGeneral: Math.round(promedioGeneral),
        totalTareas: tareas.length,
        tareasCompletadas,
        totalExamenes: examenes.length,
        examenesConNota,
        totalApuntes: apuntes.length,
      },
      materias,
      tareas,
      examenes,
      apuntes,
    };
  }

  async getReporteMaterias(usuarioId) {
    const materias = await materiasRepository.findAll(usuarioId);
    const tareas = await tareasRepository.findAll(usuarioId);
    const examenes = await examenesRepository.findAll(usuarioId);

    const reporte = materias.map(materia => {
      const tareasPorMateria = tareas.filter(t => t.materiaId === materia.id);
      const examenesPorMateria = examenes.filter(e => e.materiaId === materia.id);

      return {
        ...materia,
        estadisticas: {
          totalTareas: tareasPorMateria.length,
          tareasCompletadas: tareasPorMateria.filter(t => t.estado === 'Completada').length,
          totalExamenes: examenesPorMateria.length,
          examenesConNota: examenesPorMateria.filter(e => e.nota !== null).length,
        },
      };
    });

    return reporte;
  }

  async getReporteTareas(usuarioId) {
    const tareas = await tareasRepository.findAll(usuarioId);
    const materias = await materiasRepository.findAll(usuarioId);

    const estadisticas = {
      total: tareas.length,
      pendientes: tareas.filter(t => t.estado === 'Pendiente').length,
      enProgreso: tareas.filter(t => t.estado === 'En Progreso').length,
      completadas: tareas.filter(t => t.estado === 'Completada').length,
      porPrioridad: {
        alta: tareas.filter(t => t.prioridad === 'Alta').length,
        media: tareas.filter(t => t.prioridad === 'Media').length,
        baja: tareas.filter(t => t.prioridad === 'Baja').length,
      },
    };

    const tareasConMateria = tareas.map(tarea => {
      const materia = materias.find(m => m.id === tarea.materiaId);
      return {
        ...tarea,
        materiaNombre: materia?.nombre || 'Sin materia',
      };
    });

    return {
      estadisticas,
      tareas: tareasConMateria,
    };
  }

  async getReporteExamenes(usuarioId) {
    const examenes = await examenesRepository.findAll(usuarioId);
    const materias = await materiasRepository.findAll(usuarioId);

    const examenesConNota = examenes.filter(e => e.nota !== null);
    const promedioExamenes = examenesConNota.length
      ? examenesConNota.reduce((sum, e) => sum + e.nota, 0) / examenesConNota.length
      : 0;

    const estadisticas = {
      total: examenes.length,
      conNota: examenesConNota.length,
      sinNota: examenes.filter(e => e.nota === null).length,
      promedioGeneral: Math.round(promedioExamenes),
      preparacionPromedio: Math.round(
        examenes.reduce((sum, e) => sum + e.preparacion, 0) / examenes.length || 0
      ),
    };

    const examenesConMateria = examenes.map(examen => {
      const materia = materias.find(m => m.id === examen.materiaId);
      return {
        ...examen,
        materiaNombre: materia?.nombre || 'Sin materia',
      };
    });

    return {
      estadisticas,
      examenes: examenesConMateria,
    };
  }
}

module.exports = new ReportesService();