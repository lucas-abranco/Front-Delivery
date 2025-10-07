// Mock de Dados para o Pet Shop:src/data/petShopProducts.js
export const petShopData = {
  id: 'pet-shop-amigo-fiel',
  name: 'Pet Shop Amigo Fiel',
  categories: [
    {
      name: 'Rações',
      items: [
        { id: 301, name: 'Ração Cães Adultos 1kg', description: 'Sabor carne e vegetais.', price: '35,00' },
        { id: 302, name: 'Ração Gatos Castrados 1kg', description: 'Controle de peso.', price: '42,00' },
      ],
    },
    {
      name: 'Brinquedos',
      items: [
        { id: 303, name: 'Bolinha Maciça', description: 'Resistente a mordidas.', price: '15,00' },
      ],
    },
  ],
};