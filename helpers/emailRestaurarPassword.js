import nodemailer from 'nodemailer';

const emailRestaurar = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS
        }
      });

      //Enviar email
      const {name, email, token} = datos;

      const info = await transporter.sendMail({
        from: 'APV - Administrador de pacientes de Veterinaria',
        to: email,
        subject: 'Restaura tu password en APV',
        text: 'Restaura tu password en APV', 
        html: `<p>Hola ${name}, haz solicitado cambiar tu password. Haz clic en el siguiente enlace para cambiarlo:</p>

        <p><a href = '${process.env.FRONTEND_HOST}/restaurar-password/${token}'>Reestablecer password</a><p>
        
        <p> Si no has sido tu el que creo la cuenta, ignora este mensaje</p>`
      })
    console.log('Email enviado: %s', info.messageId)
}


export default emailRestaurar;