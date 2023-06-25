import express from "express";
import veterinarioRoutes from "./routes/veterniarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"
import conectarDB from "./config/db.js";
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config()

app.use(express.json())

conectarDB();

// 
/* const dominiosPermitidos = [process.env.FRONTEND_HOST];
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) {
            //El origen esta permitido
            callback(null, true);
        } else {
            callback(new Error('Origen no permitido'))
        }
    }
} */

/* app.use(cors(corsOptions)) */
app.use(cors())
const PORT =  4000
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(PORT, () => console.log('Servidor funcionando en el el port 4000'))