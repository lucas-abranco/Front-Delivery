// Página do Restaurante com o Pop-up:src/pages/RestaurantPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css';
import { pizzeriaMenu } from '../data/pizzeriaMenu.js';
import ProductModal from '../components/ProductModal'; // 1. Importar o Modal

const allRestaurantsData = {
  'pizzaria-bella': pizzeriaMenu,
};

// 2. O item do menu agora tem uma função para ser selecionado
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

function RestaurantPage() {
  const { restaurantId } = useParams();
  // 3. Estado para controlar qual item está no pop-up
  const [selectedItem, setSelectedItem] = useState(null);

  const menuData = allRestaurantsData[restaurantId];

  if (!menuData) {
    return <div>Restaurante não encontrado.</div>;
  }

  return (
    <>
      {/* 4. Renderiza o Modal com o item selecionado */}
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <header className={styles.restaurantHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>{menuData.restaurantName}</h1>
            <p>{`Tempo médio: ${menuData.deliveryTime} - Taxa: ${menuData.deliveryFee}`}</p>
          </div>
          {/* Botão de Ver Avaliações foi REMOVIDO */}
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.menuSection}>
          <input type="text" placeholder="Buscar no cardápio" className={styles.menuSearch} />
          {menuData.categories.map(category => (
            <section key={category.name} className={styles.category}>
              <h2>{category.name}</h2>
              <div className={styles.itemsGrid}>
                {/* 5. Passa a função para selecionar o item */}
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
export default RestaurantPage;