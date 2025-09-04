import mongoose from "mongoose";

const userApunteSchema = new mongoose.Schema({
    rut: {
        type: String,
        required: true,
        unique: true,
        cast: false
    },
    apuntesIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apunte',
        cast: false,
        unique: true
    }]
}, {
    timestamps: true,
    versionKey: false,
    strict: true
});

const UserApunte = mongoose.model('UserApunte', userApunteSchema);
export default UserApunte;