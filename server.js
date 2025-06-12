import express from 'express';
import cors from 'cors';
import { gerarPagamentoPIX } from './pix-api.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/pix', async (req, res) => {
  try {
    const { nome, email } = req.body;
    const data = await gerarPagamentoPIX(nome, email);
    res.json(data);
  } catch (err) {
    console.error('Erro ao gerar pagamento PIX:', err);
    res.status(500).json({ erro: 'Erro interno ao gerar pagamento' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});