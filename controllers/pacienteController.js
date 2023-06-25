import Paciente from "../models/Paciente.js";

// Acciones por veterinario
const agregarPaciente = async (req, res) => {
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;

  try {
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    res.status(404).json({ msg: error.message })
  }
};

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;

  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(403).json({ msg: "No existe el paciente" });
  }

  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  //Obtener paciente
  res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;

  const paciente = await Paciente.findById(id);

  if (!paciente) {
   return  res.status(403).json({ msg: "No existe el paciente" });
  }

  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.status(403).json({ msg: "Accion no valida"});
  }

  //Actualizar al paciente

 paciente.nombre = req.body.nombre || paciente.nombre;
 paciente.sintomas = req.body.sintomas || paciente.sintomas;
 paciente.propietario = req.body.propietario || paciente.propietario;
 paciente.fecha = req.body.fecha || paciente.fecha;
 paciente.email = req.body.email || paciente.email;

  try {
    const pacienteActualizado = await paciente.save();
    return res.json(pacienteActualizado)

  } catch (error) {
    console.error(error)
  }

 
};
const eliminarPaciente = async (req, res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);
  
    if (!paciente) {
     return  res.status(403).json({ msg: "No existe el paciente" });
    }
  
    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
      return res.status(403).json({ msg: "Accion no valida"});
    }


    try {
        await paciente.deleteOne();
        return res.json({msg: `Paciente ${id} eliminado`})
    
      } catch (error) {
        console.error(error)
      }

};

//Lista de pacientes
const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find()
    .where("veterinario")
    .equals(req.veterinario);

  res.json(pacientes);
};

export {
  agregarPaciente,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
  obtenerPacientes,
};
