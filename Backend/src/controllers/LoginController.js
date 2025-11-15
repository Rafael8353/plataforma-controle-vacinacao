// src/controllers/LoginController.js

class LoginController {
    /**
     * @param {UserService} userService
     */
    constructor(userService) {
        this.userService = userService;
    }

    /**
     * Lida com a requisição de login
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */
async handleLogin(req, res) {
      
     
        const { identifier, password } = req.body;

       
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Identificador (e-mail/CPF) e senha são obrigatórios.' });
        }

        try {
       
            const token = await this.userService.login(identifier, password);
            
            return res.status(200).json({ token });

        } catch (error) {
            // Usando a mensagem "Credenciais inválidas" pedida nos requisitos
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    }
}

module.exports = LoginController;