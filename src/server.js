import express from 'express'
import {config} from 'dotenv'
const app = express();

//Import Routes
import authRoutes from './routes/authRoutes.js'

config();

app.use(express.json());


app.use("/auth", authRoutes)

const PORT = 3001;
app.listen(PORT, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
});