const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {

    async login(req, res) {

        try {

            const { email, senha } = req.body

            const user = await prisma.user.findUnique({
                where: { email }
            })

            if (!user) {
                return res.status(400).json({
                    error: 'Email ou senha inválidos'
                })
            }

            const senhaValida = await bcrypt.compare(
                senha,
                user.senhaHash
            )

            if (!senhaValida) {
                return res.status(400).json({
                    error: 'Email ou senha inválidos'
                })
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    perfil: user.perfil
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1d'
                }
            )

            res.json({
                token
            })

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }

    }

}