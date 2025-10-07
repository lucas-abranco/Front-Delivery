// Nosso "banco de dados" de usuários.
// Em uma aplicação real, isso viria de uma API.
export const initialUsers = [
  {
    id: 1,
    name: 'Cliente Exemplo',
    cpf: '123.456.789-00', // Um CPF válido para teste
    phone: '(99) 99999-9999',
    email: 'cliente@exemplo.com',
    password: '123', // Em um app real, a senha NUNCA fica assim.
  },
];
