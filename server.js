import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Configurar CORS para aceitar origens de uma variável de ambiente
const corsOption = {
  origin: process.env.CORS_ORIGIN || '*', // Aceita qualquer origem por padrão
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));

// Rotas
app.post('/usuarios', async (req, res) => {
  await prisma.user.create({
    data: {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status,
    },
  });
  res.status(201).json(req.body);
});

app.get('/usuarios', async (req, res) => {
  let users = [];
  if (req.query) {
    users = await prisma.user.findMany({
      where: {
        titulo: req.query.titulo,
        descricao: req.query.descricao,
        status: req.query.status,
      },
    });
  }
  res.status(200).json(users);
});

app.put('/usuarios/:id', async (req, res) => {
  await prisma.user.update({
    where: { id: parseFloat(req.params.id) },
    data: {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status,
    },
  });
  res.status(200).send();
});

app.delete('/usuarios/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: parseFloat(req.params.id) } });
  res.status(200).json({ message: 'Usuário deletado com sucesso' });
});

// Usar a variável PORT fornecida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
