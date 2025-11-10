import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css'; // Reutilizando os mesmos estilos
// import { petShopData } from '../data/petShopProducts.js'; // REMOVIDO
import { CartContext, useCart } from '../contexts/CartContext'; // Importar o Contexto e o hook
import ProductModal from '../components/ProductModal/ProductModal.jsx';

const API_URL = 'http://localhost:3000';

// Componente para o item do menu, agora com lógica para abrir o modal E adicionar ao carrinho
function MenuItem({ item, onSelect }) {
  const { addToCart } = useCart(); // Obtém a função de adicionar ao carrinho
  
  return (
    // Clicar no card inteiro abre o modal
    <div className={styles.menuItem} onClick={() => onSelect(item)}>
      <div className={styles.itemInfo}>
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <span>R$ {item.price}</span>
      </div>
      <div className={styles.itemImagePlaceholder}>
        {/* Botão para adicionar diretamente ao carrinho */}
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

function PetShopPage() {
  const { petShopId } = useParams(); // Agora usamos o ID
  const [selectedItem, setSelectedItem] = useState(null);
  const [shopData, setShopData] = useState(null); // Estado para os dados da API
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os dados da API quando a página carrega
  useEffect(() => {
    const fetchPetShopData = async () => {
      setLoading(true);
      try {
        // Chama a mesma rota de menu que o restaurante usa
        const response = await fetch(`${API_URL}/stores/${petShopId}/menu`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do pet shop.');
        }
        const data = await response.json();
        // Adiciona o storeId a cada item (necessário para o CartContext)
        const menuWithStoreId = data.menu.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            storeId: data.id // Adiciona o ID da loja ao item
          }))
        }));
        setShopData({ ...data, menu: menuWithStoreId });
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchPetShopData();
  }, [petShopId]); // Re-executa se o ID na URL mudar

  if (loading) {
    return <div style={{padding: '2rem'}}>A carregar produtos...</div>;
  }

  if (!shopData) {
    return <div style={{padding: '2rem'}}>Pet Shop não encontrado.</div>;
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
          {shopData.menu.map(category => (
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