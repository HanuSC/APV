import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
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
        subject: 'Verifica tu cuenta en APV',
        text: 'Verifica tu cuenta en APV', 
        html: `<p>Hola ${name}, tu cuenta en APV esta casi lista. Haz clic en el siguiente enlace para verificarla:</p>

        <p><a href = '${process.env.FRONTEND_HOST}/confirmar/${token}'>Verificar cuenta</a><p>
        
        <p> Si no has sido tu el que creo la cuenta, ignora este mensaje</p>`
      })
    console.log('Email enviado: %s', info.messageId)
}


export default emailRegistro;