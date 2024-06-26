import express from 'express'
import router from './src/routes/index.js';

import dotenv from "dotenv";
import cors from "cors";
import sequelize from './src/database/connectDb.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
sequelize.sync()
app.listen(PORT, () => {
  console.log(`Server Started at :${PORT}`);
});
app.use(router)
