import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css'; // Reutilizando estilos
import { petShopData } from '../data/petShopProducts.js';
// CORREÇÃO AQUI: O caminho foi ajustado para corresponder à sua estrutura de ficheiros
import ProductModal from '../components/ProductModal/ProductModal.jsx';

// Componente para o item do menu, agora com lógica para abrir o modal
function MenuItem({ item, onSelect }) {
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

function PetShopPage() {
  const { _petShopId } = useParams();
  const [selectedItem, setSelectedItem] = useState(null);
  
  const shopData = petShopData;

  if (!shopData) {
    return <div>Pet Shop não encontrado.</div>;
  }

  return (
    <>
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
                {category.items.map(item => (
                  <MenuItem key={item.id} item={item} onSelect={setSelectedItem} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

export default PetShopPage;
