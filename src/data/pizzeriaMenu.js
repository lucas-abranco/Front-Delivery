// Mock de dados para uma pizzaria específica
export const pizzeriaMenu = {
  id: 'pizzaria-bella',
  restaurantName: 'Pizzaria Bella',
  deliveryTime: '30-45 min',
  deliveryFee: 'R$ 5,00',
  categories: [
    {
      name: 'Pizzas Salgadas',
      items: [
        { id: 101, name: 'Margherita', description: 'Molho, mussarela e manjericão fresco.', price: '45,00' },
        { id: 102, name: 'Calabresa', description: 'Molho, mussarela e calabresa fatiada.', price: '48,00' },
        { id: 103, name: 'Quatro Queijos', description: 'Mussarela, provolone, parmesão e gorgonzola.', price: '52,00' },
      ],
    },
    {
      name: 'Bebidas',
      items: [
        { id: 104, name: 'Refrigerante 2L', description: '', price: '12,00' },
        { id: 105, name: 'Cerveja Long Neck', description: '', price: '8,00' },
      ],
    },
  ],
};