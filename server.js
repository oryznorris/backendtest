import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Configuração dinâmica do CORS com base na variável de ambiente
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*', // Pega a URL do frontend da variável de ambiente
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Permitir cookies e autenticação
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Lida com requisições preflight

// Rotas
app.post('/User', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
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

    res.status(200).json(users || []);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.put('/User/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

app.delete('/User/:id', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// Usar a variável PORT fornecida pelo Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
