require('./models');
require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'A api está funcionando'
  });
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
});
