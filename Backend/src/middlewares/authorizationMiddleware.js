/**
 * Factory de middleware para verificar o perfil (role) do usuário.
 *
 * @param {string[]} allowedRoles - Um array de perfis permitidos (ex: ['profissional_de_saude'])
 * @returns {import('express').RequestHandler}
 */
function authorize(allowedRoles) {
    /**
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {import('express').NextFunction} next
     */
    return (req, res, next) => {
        // Pega o 'role' do usuário que foi anexado pelo authMiddleware
        const { role } = req.user;

        if (!role || !allowedRoles.includes(role)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
        }

        // Se o perfil estiver na lista, permite o acesso
        return next();
    };
}

module.exports = authorize;