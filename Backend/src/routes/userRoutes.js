const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.post("/user/register", async (req, res) => {
    try {
        const { nome, dataNascimento, email, cpf, password, telefone, susCardNumber } = req.body;

        const requiredFields = [
            { field: 'nome', value: nome, message: 'O nome é obrigatório!' },
            { field: 'dataNascimento', value: dataNascimento, message: 'A data de nascimento é obrigatória!' },
            { field: 'email', value: email, message: 'O email é obrigatório!' },
            { field: 'cpf', value: cpf, message: 'O CPF é obrigatório!' },
            { field: 'password', value: password, message: 'A senha é obrigatória!' },
            { field: 'telefone', value: telefone, message: 'O telefone é obrigatório!' },
            { field: 'susCardNumber', value: susCardNumber, message: 'O número do cartão SUS é obrigatório!' }
        ];

        for (let i = 0; i < requiredFields.length; i++) {
            const item = requiredFields[i];
            if (!item.value) {
                return res.status(422).json({ msg: item.message });
            }
        }

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ msg: "Este email já está cadastrado!" });
        }

        const cpfExists = await User.findOne({ where: { cpf } });
        if (cpfExists) {
            return res.status(400).json({ msg: "Este CPF já está cadastrado!" });
        }

        const newUser = await User.create({
            nome,
            dataNascimento,
            email,
            cpf,
            password, // criar a cripto
            telefone,
            susCardNumber
        });

        return res.status(201).json({ msg: "Usuário registrado com sucesso!", user: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Erro no servidor, tente novamente mais tarde." });
    }
});



module.exports = router;