import fetch from 'node-fetch';

export async function gerarPagamentoPIX(nome, email = 'contato@contato.com.br') {
  const criar = await fetch('https://api.bynetglobal.com.br/v1/transactions', {
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
          unitPrice: 10,
          quantity: 1
        }
      ]
    })
  });

  const data = await criar.json();
  console.log('ID da transação:', data.id);

  // espera 5 segundos antes de verificar
  await new Promise(resolve => setTimeout(resolve, 5000));

  const verificar = await fetch(`https://api.bynetglobal.com.br/v1/transactions/${data.id}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': 'Basic c2tfbGl2ZV92MnlncVVRa0lVVGU1YkExTk41UWlqVUZ5THVlQjZxQzliQ0x0NjNjTDA6eA=='
    }
  });

  const status = await verificar.json();
  console.log('STATUS DO PAGAMENTO:', status.status); // "paid", "waiting" etc.

  return { ...data, status: status.status };
}
