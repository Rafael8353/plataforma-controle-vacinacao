require('dotenv').config();
const express = require('express');
const routes = require('./routes/teste');
require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'A api está funcionando'
  });
});

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}/`);
});
