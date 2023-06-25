import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import generarID from '../helpers/generarID.js';

const veterinarioSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: null,
        trim: true
    },
    website: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarID()

    },
    confirmed: {
        type: Boolean,
        default: false
    }


});

veterinarioSchema.pre('save', async function(next) {

    if (!this.isModified("password")) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

veterinarioSchema.methods.comprobarPassword = async function (password_form) {
    return await bcrypt.compare(password_form, this.password);
};

const Veterniario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterniario;