import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())               // instalar a biblioteca do cors permite que qualquer um acesse o backend
const corsOption = {
    origin: 'https://comfortable-contentment-production.up.railway.app',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}
app.use(cors(corsOption));

app.post('/usuarios', async (req,res) =>{

   await prisma.user.create({

        data: {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            status: req.body.status
        }
    })

    res.status(201).json(req.body)
})

app.get('/usuarios', async(req, res) => {
    let users = []

    if(req.query){
        users = await prisma.user.findMany({
            where: {
                titulo: req.query.titulo,
                descricao: req.query.descricao,
                status: req.query.status
            }
        })
    }

    res.status(200).json(users)
})

app.put('/usuarios/:id', async (req, res) => {

    await prisma.user.update({
        where: {
            id: parseFloat(req.params.id)

        },
        data: {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            status: req.body.status
        }
    })
})

app.delete('/usuarios/:id', async(req,res) =>{

    await prisma.user.delete({
        where: {
            id: parseFloat(req.params.id)
        }
    })
    res.status(200).json({message: 'Usuário deletado com sucesso'})
})
app.listen(3000)

const PORT = process.env.PORT || 3306;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
