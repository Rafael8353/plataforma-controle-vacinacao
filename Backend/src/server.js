require('dotenv').config();
require('./models');

const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const vaccineLotRoutes = require('./routes/VaccineLotRoutes'); 
const vaccinationRecordRoutes = require('./routes/VaccinationRecordRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/lotes', vaccineLotRoutes);
app.use(vaccinationRecordRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'A api está funcionando'
  });
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
});
