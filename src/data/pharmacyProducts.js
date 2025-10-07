// Mock de dados para uma farmácia específica
export const pharmacyData = {
  id: 'farmacia-saude-bem-estar',
  name: 'Farmácia Saúde & Bem-Estar',
  categories: [
    {
      name: 'Medicamentos',
      items: [
        { id: 201, name: 'Analgésico 10 Comp.', description: 'Para dores de cabeça e musculares.', price: '15,50' },
        { id: 202, name: 'Antigripal', description: 'Alívio dos sintomas da gripe.', price: '22,90' },
      ],
    },
    {
      name: 'Higiene Pessoal',
      items: [
        { id: 203, name: 'Sabonete Líquido', description: '250ml, fragrância suave.', price: '18,00' },
        { id: 204, name: 'Fio Dental', description: '50m, menta.', price: '9,90' },
      ],
    },
  ],
};
