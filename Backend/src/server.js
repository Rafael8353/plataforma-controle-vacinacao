require('./models');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const vaccineLotRoutes = require('./routes/VaccineLotRoutes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/lotes', vaccineLotRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'A api está funcionando'
  });
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
});
