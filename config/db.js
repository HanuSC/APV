import  mongoose from "mongoose";

const conectarDB = async () => {
    try {

        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`Conexion a db en: ${url}`)

    } catch(error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    };
}

export default conectarDB;