import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


mongoose.connect(process.env.MONGODB_URI).then( ()=> {
    console.log('Connected to the database');
    
}).catch((err) => {
    console.log('Connection failed');
});
const app = express();
app.use(express.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

