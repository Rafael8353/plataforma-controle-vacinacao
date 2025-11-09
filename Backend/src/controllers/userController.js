const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userController = {
  async register(req, res) {
    try {
      const {
        nomeCompleto,
        dataNascimento,
        cpf,
        email,
        password,
        telefone,
        role,
        sus_card_number,
        professional_register
      } = req.body;

      if (!role || (role !== 'patient' && role !== 'health_professional')) {
        return res.status(400).json({ message: 'Role é inválido ou não foi fornecido.' });
      }
      if (!nomeCompleto || !dataNascimento || !cpf || !email || !password || !telefone) {
        return res.status(422).json({ message: 'Todos os campos base são obrigatórios.' });
      }
      if (role === 'patient' && !sus_card_number) {
        return res.status(400).json({ message: 'O campo sus_card_number é obrigatório para pacientes.' });
      }
      if (role === 'health_professional' && !professional_register) {
        return res.status(400).json({ message: 'O campo professional_register é obrigatório para profissionais de saúde.' });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email: email }, { cpf: cpf }]
        }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ou CPF são invalidos.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name: nomeCompleto,             
        birth_date: dataNascimento,     
        cpf: cpf,
        email: email,
        password_hash: hashedPassword,  
        phone_number: telefone,         
        role: role,
        sus_card_number: role === 'patient' ? sus_card_number : null,
        professional_register: role === 'health_professional' ? professional_register : null
    });

      const payload = {
        userId: newUser.id,
        role: newUser.role
      };
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("JWT_SECRET não foi definido no .env!");
        return res.status(500).json({ message: 'Erro interno na configuração do servidor.' });
      }
      const token = jwt.sign(payload, secret, { expiresIn: '1d' });

      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso!',
        token: token
      });

    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email ou CPF já cadastrados (erro do banco).' });
      }
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
  }
};

module.exports = userController;