export const ordersData = [
  {
    id: 'PEDIDO-001',
    userId: 1, // Associado ao Cliente Exemplo com id 1
    driverId: null,
    status: 'Em andamento',
    restaurant: 'Pizzaria Bella',
    pickupAddress: 'Avenida Brasil, 100',
    deliveryAddress: 'Rua das Flores, 250',
    items: [
      { name: '1x Pizza Margherita', price: '45,00' },
      { name: '1x Refrigerante 2L', price: '12,00' },
    ],
    total: '57,00',
    date: '10/10/2025',
  },
  {
    id: 'PEDIDO-002',
    userId: 1,
    driverId: null,
    status: 'Em andamento', // Deixado em andamento para testes do entregador
    restaurant: 'Burger House',
    pickupAddress: 'Rua Central, 55',
    deliveryAddress: 'Praça Azul, 780',
    items: [
      { name: '1x Cheeseburger', price: '26,90' },
    ],
    total: '26,90',
    date: '09/10/2025',
  },
  {
    id: 'PEDIDO-003',
    userId: 2, // Pedido de outro cliente (não aparecerá para o cliente 1)
    driverId: null,
    status: 'Entregue',
    restaurant: 'Restaurante Exemplo',
    pickupAddress: 'Rua Alpha, 12',
    deliveryAddress: 'Av. Europa, 340',
    items: [
      { name: '1x Veggie', price: '29,90' },
    ],
    total: '29,90',
    date: '08/10/2025',
  },
];

