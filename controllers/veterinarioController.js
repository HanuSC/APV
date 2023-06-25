import emailRegistro from "../helpers/emailRegistro.js"
import emailRestaurar from "../helpers/emailRestaurarPassword.js"
import generarID from "../helpers/generarID.js"
import generarJWT from "../helpers/generarJWT.js"
import Veterinario from "../models/Veterinario.js"

const registrar = async (req, res) => {
    const { email, name } = req.body 
   //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({ email })
//Comprobar si existe el user en la db
    if (existeUsuario) {
        // ! error
        const error = new Error('El Usuario ya existe')
        return res.status(400).json({ msg: error.message })
    }

   try {
    //save new vet
    const vet = new Veterinario(req.body);
    const savedVet = await vet.save()
    //Enviar email

    emailRegistro({
        email, name, token: savedVet.token
    });

    // * enviar el Veterinario como json a db
    res.json(savedVet)
   
   } catch(error) {
       console.error(error)
   }

}

const perfil = (req, res) => {
    const {veterinario} = req;
    res.json(veterinario)
}

const confirmar = async (req, res) => {
//Extraer el token de del user
    const { token } = req.params
    const usuarioConfirmar = await Veterinario.findOne({ token }) //Comprobar que sea el mismo token

    if(!usuarioConfirmar) {
        const error = new Error('Token no valido')
        return res.status(404).json({ msg: error.message })
    }

    try {
        //Si el token de confirmacion de cuenta es valido, lo seteamos a null y la propiedad confirmed a true
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmed = true
        //guardamos el usuario
        await usuarioConfirmar.save()
        res.json({msg: 'Usuario confirmado correctamente'})

    } catch(error) {
        console.error(error)
    } 
}

const forgotPassword = async (req, res) => {
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({email})
    if (!existeVeterinario) {
        const error = new Error('No se encontro el email');
        return res.status(403).json({msg: error.message});
    }
    

    try {
        existeVeterinario.token = generarID();

        await existeVeterinario.save();

        //enviar email
        const { name, token} = existeVeterinario;
        emailRestaurar({name, email, token});
        console.log({name, email, token})

        res.json({msg: 'Hemos enviado un email para recuperar su cuenta'})

    } catch (error) {
        console.error(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } =  req.params
    const tokenValido = await Veterinario.findOne({ token })
    if (tokenValido) {
        //el token es valido
       res.json({msg: 'El usuario existe'})
    } else {
        const error = new Error('Token no valido');
        return res.status(403).json({msg: error.message})
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token })

    if (!veterinario) {
        const error= new Error('Hubo un error');
        return res.status(403).json({msg: error.message})
    }

     try {
        //SETEA EL PASSWORD
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
        
     } catch (error) {
        console.error(error);
     }

    


}

const autenticar = async (req, res) => {

    const { email, password } = req.body

    //comprobar si el usaurio existe
    const usuario = await Veterinario.findOne({ email })
    if (!usuario) {
        const error = new Error('El Usuario no existe')
        return res.status(404).json({ msg: error.message })
    }

    //comprobar si el usuario esta confirmado
    if (!usuario.confirmed) {
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({ msg: error.message })
    }

    //Revisar el password
    if (await usuario.comprobarPassword(password)) {
        //autenticar al user
        res.json({
            _id: usuario._id, 
            name: usuario.name,
            email: usuario.email,
            token: generarJWT(usuario._id)
        });

    } else {
        const error = new Error('Password Invalido')
        return res.status(404).json({ msg: error.message })
    }

}

const actualizarPerfil = async (req, res) => {
 
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    if (veterinario.email !== req.body.email) {
        const existeEmail = await Veterinario.findOne({ email: req.body.email})

        if(existeEmail) {
            const error = new Error('Ya existe el email')
            return res.status(400).json({msg: error.message})
            return
        }
    }

    try {
      veterinario.name = req.body.name   
      veterinario.email = req.body.email 
      veterinario.website = req.body.website 
      veterinario.phone = req.body.phone  


      const veterinarioActualizado = await veterinario.save();
      res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async ( req, res) => {
    const { id } = req.veterinario;
    const { pwd_nueva, pwd_actual} = req.body

    const veterinario = await Veterinario.findById(id)
    if(!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }

    if ( await veterinario.comprobarPassword(pwd_actual) ) {
        veterinario.password = pwd_nueva;
        await veterinario.save();
        res.json({
            msg: 'Password actualizado exitosamente!'
        })
    } else {
        const error = new Error('El password actual es incorrecto')
        return res.status(400).json({msg: error.message})
    }

}

export {
    registrar,
    perfil, 
    confirmar,
    autenticar,
    forgotPassword, 
    comprobarToken,
    nuevoPassword, 
    actualizarPerfil, 
    actualizarPassword
}