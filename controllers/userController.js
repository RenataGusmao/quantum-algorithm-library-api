const prisma = require('../config/prisma')
const bcrypt = require('bcrypt')

module.exports = {

    async create(req, res) {
        try {

            const {
                nome,
                email,
                senha,
                perfil
            } = req.body

            const userExists = await prisma.user.findUnique({
                where: { email }
            })

            if (userExists) {
                return res.status(400).json({
                    error: 'Usuário já existe'
                })
            }

            const senhaHash = await bcrypt.hash(senha, 10)

            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    senhaHash,
                    perfil
                }
            })

            res.status(201).json(user)

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }
    },

    async findAll(req, res) {
        try {

            const users = await prisma.user.findMany()

            res.json(users)

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }
    },

    async findById(req, res) {

        try {

            const { id } = req.params

            const user = await prisma.user.findUnique({
                where: { id }
            })

            if (!user) {
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                })
            }

            res.json(user)

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }

    },

    async update(req, res) {

        try {

            const { id } = req.params

            const user = await prisma.user.update({
                where: { id },
                data: req.body
            })

            res.json(user)

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }

    },

    async remove(req, res) {

        try {

            const { id } = req.params

            await prisma.user.delete({
                where: { id }
            })

            res.json({
                message: 'Usuário removido'
            })

        } catch (error) {

            res.status(500).json({
                error: error.message
            })

        }

    }

}