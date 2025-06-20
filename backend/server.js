import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


mongoose.connect("mongodb+srv://rushitarpe749:rushitarpe749@cluster0.zasqi5f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then( ()=> {
    console.log('Connected to the database');
    
}).catch((err) => {
    console.log('Connection failed');
});
const app = express();
app.use(express.json());

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

