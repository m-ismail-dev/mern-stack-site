import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, unique: true, minlength: 8, select: false }
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
});

userSchema.methods.matchPassword = function(password) {
    return bcrypt.compare(password, this.password)
};

export default mongoose.model('User', userSchema);