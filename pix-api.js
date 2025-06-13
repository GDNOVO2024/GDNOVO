// server.js

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/pix', async (req, res) => {
  const { nome, email } = req.body;

  try {
    const criar = await fetch('https://api.bynetglobal.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: 'Basic c2tfbGl2ZV92MnlncVVRa0lVVGU1YkExTk41UWlqVUZ5THVlQjZxQzliQ0x0NjNjTDA6eA==',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        customer: { name: nome, email },
        amount: 100,
        paymentMethod: 'pix',
        items: [
          {
            tangible: true,
            title: 'curso marketing',
            unitPrice: 100,
            quantity: 1
          }
        ]
      })
    });

    const data = await criar.json();

    // ❗ Aqui está o que o frontend precisa:
    res.json({
      id: data.id,
      pix: {
        qrcode: data.qrCodeText || data.pix.qrcode || '' // usa o campo correto se disponível
      }
    });

  } catch (e) {
    console.error('Erro no servidor:', e);
    res.status(500).json({ error: 'Erro ao gerar pagamento.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
