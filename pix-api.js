// arquivo: server.js (ou index.js, backend hospedado no Render)

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/criar-pagamento', async (req, res) => {
  const { nome, email } = req.body;

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
  let status = 'waiting';
  const maxTentativas = 6;

  for (let i = 0; i < maxTentativas; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));

    const verificar = await fetch(`https://api.bynetglobal.com.br/v1/transactions/${data.id}`, {
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

  res.json({ status });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
