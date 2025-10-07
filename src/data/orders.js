// Crie um novo ficheiro para o nosso mock de pedidos
// Mock de Dados para Pedidos:src/data/orders.js
export const ordersData = [
  {
    id: 'PEDIDO-001',
    status: 'Em andamento',
    restaurant: 'Pizzaria Bella',
    items: [
      { name: '1x Pizza Margherita', price: '45,00' },
      { name: '1x Refrigerante 2L', price: '12,00' },
    ],
    total: '57,00',
    date: '07/10/2025',
  },
  {
    id: 'PEDIDO-002',
    status: 'Entregue',
    restaurant: 'Restaurante Exemplo',
    items: [
      { name: '1x Cheeseburger', price: '26,90' },
    ],
    total: '26,90',
    date: '05/10/2025',
  },
];