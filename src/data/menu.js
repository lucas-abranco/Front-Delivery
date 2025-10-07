// Mock de dados para o cardápio de um restaurante exemplo
export const menuData = {
  restaurantName: 'Restaurante Exemplo',
  deliveryTime: '40-50 min',
  deliveryFee: 'R$ 6,90',
  categories: [
    {
      name: 'Destaques',
      items: [
        { id: 1, name: 'Cheeseburger', description: 'Pão, carne 160g, queijo...', price: '26,90' },
        { id: 2, name: 'Duplo Bacon', description: 'Dois hambúrgueres...', price: '34,90' },
        { id: 3, name: 'Veggie', description: 'Grão de bico...', price: '29,90' },
      ],
    },
    {
      name: 'Bebidas',
      items: [
        { id: 4, name: 'Refrigerante Lata', description: '', price: '7,00' },
        { id: 5, name: 'Suco Natural', description: '', price: '10,00' },
        { id: 6, name: 'Água 500ml', description: '', price: '4,50' },
      ],
    },
  ],
};
