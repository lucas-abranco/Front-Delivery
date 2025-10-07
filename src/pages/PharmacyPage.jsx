import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css'; // Reutilizando os mesmos estilos
import { pharmacyData } from '../data/pharmacyProducts.js';
import ProductModal from '../components/ProductModal'; // 1. Importar o Modal

// Componente para o item, agora com lógica para abrir o modal
function PharmacyItem({ item, onSelect }) {
  return (
    <div className={styles.menuItem} onClick={() => onSelect(item)}>
      <div className={styles.itemInfo}>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <span>R$ {item.price}</span>
      </div>
      <div className={styles.itemImagePlaceholder}></div>
    </div>
  );
}

function PharmacyPage() {
  const { _pharmacyId } = useParams();
  // 2. Adicionar o estado para controlar o item selecionado no pop-up
  const [selectedItem, setSelectedItem] = useState(null);
  
  const shopData = pharmacyData;

  if (!shopData) {
    return <div>Farmácia não encontrada.</div>;
  }

  return (
    <>
      {/* 3. Renderizar o modal */}
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      
      <header className={styles.restaurantHeader}>
        <div className={styles.headerContent}>
          <h1>{shopData.name}</h1>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.menuSection}>
          <input type="text" placeholder="Buscar produto" className={styles.menuSearch} />
          {shopData.categories.map(category => (
            <section key={category.name} className={styles.category}>
              <h2>{category.name}</h2>
              <div className={styles.itemsGrid}>
                {/* 4. Usar o novo componente e passar a função para selecionar o item */}
                {category.items.map(item => (
                  <PharmacyItem key={item.id} item={item} onSelect={setSelectedItem} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

export default PharmacyPage;

