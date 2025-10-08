import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css';
import { CartContext } from '../contexts/CartContext';
import { pizzeriaMenu } from '../data/pizzeriaMenu.js';
// CORREÇÃO AQUI: O caminho foi ajustado para corresponder à sua estrutura de ficheiros
import ProductModal from '../components/ProductModal.jsx';

const allRestaurantsData = {
  'pizzaria-bella': pizzeriaMenu,
};

// O item do menu agora tem uma função para ser selecionado
function MenuItem({ item, onSelect }) {
    // Adicionamos a lógica do carrinho aqui também para o botão '+'
    const { addToCart } = useContext(CartContext);
    return (
        // Clicar no card abre o modal
        <div className={styles.menuItem} onClick={() => onSelect(item)}>
            <div className={styles.itemInfo}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span>R$ {item.price}</span>
            </div>
            <div className={styles.itemImagePlaceholder}>
                {/* Botão para adicionar diretamente ao carrinho sem abrir o modal */}
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); // Impede que o clique no botão abra o modal
                        addToCart(item); 
                    }} 
                    className={styles.addButton}
                >
                    +
                </button>
            </div>
        </div>
    );
}

function RestaurantPage() {
  const { restaurantId } = useParams();
  // Estado para controlar qual item está no pop-up
  const [selectedItem, setSelectedItem] = useState(null);
  const menuData = allRestaurantsData[restaurantId];

  if (!menuData) {
    return <div>Restaurante não encontrado.</div>;
  }

  return (
    <>
      {/* Renderiza o Modal com o item selecionado */}
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      <header className={styles.restaurantHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>{menuData.restaurantName}</h1>
            <p>{`Tempo médio: ${menuData.deliveryTime} - Taxa: ${menuData.deliveryFee}`}</p>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.menuSection}>
          <input type="text" placeholder="Buscar no cardápio" className={styles.menuSearch} />
          {menuData.categories.map(category => (
            <section key={category.name} className={styles.category}>
              <h2>{category.name}</h2>
              <div className={styles.itemsGrid}>
                {/* Passa a função para selecionar o item */}
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

