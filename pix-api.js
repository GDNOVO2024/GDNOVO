import fetch from 'node-fetch';

export async function gerarPagamentoPIX(nome, email = 'contato@contato.com.br') {
  const resposta = await fetch('https://api.bynetglobal.com.br/v1/transactions', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'authorization': 'Basic c2tfbGl2ZV92MnlncVVRa0lVVGU1YkExTk41UWlqVUZ5THVlQjZxQzliQ0x0NjNjTDA6eA==',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      customer: { name: nome, email },
      amount: 18930,
      paymentMethod: 'pix',
      items: [
        {
          tangible: true,
          title: 'curso marketing',
          unitPrice: 18930,
          quantity: 1
        }
      ]
    })
  });

  const data = await resposta.json();
  return data;
}