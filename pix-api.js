// server.js

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000; // Render precisa dessa linha para porta dinâmica

app.use(cors());
app.use(express.json());

app.post('/criar-pagamento', async (req, res) => {
  const { nome, email } = req.body;

  try {
    // 1. Cria o pagamento
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
    const transactionId = data.id;
    let status = 'waiting';

    // 2. Verifica status 6 vezes (30s)
    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const verificar = await fetch(https://api.bynetglobal.com.br/v1/transactions/${transactionId}, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: 'Basic c2tfbGl2ZV92MnlncVVRa0lVVGU1YkExTk41UWlqVUZ5THVlQjZxQzliQ0x0NjNjTDA6eA=='
        }
      });

      const resultado = await verificar.json();
      status = resultado.status;
      if (status === 'paid') break;
    }

    // 3. Retorna status
    res.json({ status });

  } catch (e) {
    console.error('Erro no servidor:', e);
    res.status(500).json({ error: 'Erro ao processar pagamento.' });
  }
});

app.listen(PORT, () => {
  console.log(Servidor rodando na porta ${PORT});
});
