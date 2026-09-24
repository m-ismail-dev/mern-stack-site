import mongoose from 'mongoose';

export default async function connectDB() {
    await mongoose.connect(process.env.MONGOOSE_URI);
    console.log('MongoDB connected');
}