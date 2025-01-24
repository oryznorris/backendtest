import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Configuração do CORS
const corsOptions = {
    origin: 'https://frontendtest-production-a47b.up.railway.app', // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));

// Lidar com Preflight Requests (OPTIONS)
app.options('*', cors(corsOptions)); // Garante que as requisições OPTIONS sejam tratadas

// Rotas
app.post('/User', async (req, res) => {
  await prisma.user.create({
    data: {
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      status: req.body.status,
    },
  });
  res.status(201).json(req.body);
});

app.get('/User', async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          titulo: req.query.titulo || undefined,
          descricao: req.query.descricao || undefined,
          status: req.query.status || undefined,
        },
      });
  
      res.status(200).json(users || []); // Retorna sempre um array
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  });

app.put('/User/:id', async (req, res) => {
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

app.delete('/User/:id', async (req, res) => {
  await prisma.user.delete({ where: { id: parseFloat(req.params.id) } });
  res.status(200).json({ message: 'Usuário deletado com sucesso' });
});

// Usar a variável PORT fornecida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
