import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './RestaurantPage.module.css';
import { CartContext, useCart } from '../contexts/CartContext'; // Importar o Contexto e o hook
// import { pizzeriaMenu } from '../data/pizzeriaMenu.js'; // REMOVIDO
import ProductModal from '../components/ProductModal/ProductModal.jsx';

const API_URL = 'http://localhost:3000';

// Componente para um item individual do menu
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

// Componente principal da página do restaurante
function RestaurantPage() {
  const { restaurantId } = useParams(); // Pega o ID da URL (ex: 'pizzaria-bella')
  const [selectedItem, setSelectedItem] = useState(null); // Controla o item no modal
  const [storeData, setStoreData] = useState(null); // Guarda os dados vindos da API
  const [loading, setLoading] = useState(true); // Controla o estado de carregamento

  // Efeito para buscar os dados da API quando a página carrega
  useEffect(() => {
    const fetchStoreMenu = async () => {
      setLoading(true);
      try {
        // Chama a rota do back-end que criámos
        const response = await fetch(`${API_URL}/stores/${restaurantId}/menu`);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do restaurante.');
        }
        const data = await response.json();
        
        // CORREÇÃO DE BUG: Adiciona o storeId a cada item
        // Isto é crucial para que o CartContext saiba de qual loja o item é
        const menuWithStoreId = data.menu.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            storeId: data.id // Adiciona o ID da loja ao item
          }))
        }));
        
        setStoreData({ ...data, menu: menuWithStoreId }); // Guarda os dados da API no estado
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchStoreMenu();
  }, [restaurantId]); // Este efeito corre sempre que o ID do restaurante na URL mudar

  if (loading) {
    return <div style={{padding: '2rem'}}>A carregar cardápio...</div>;
  }

  if (!storeData) {
    return <div style={{padding: '2rem'}}>Restaurante não encontrado.</div>;
  }

  return (
    <>
      {/* O Modal do produto (pop-up) */}
      <ProductModal item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Cabeçalho com os dados do restaurante */}
      <header className={styles.restaurantHeader}>
        <div className={styles.headerContent}>
          <div>
            <h1>{storeData.name}</h1>
            <p>{`Tempo médio: ${storeData.deliveryTime} - Taxa: R$ ${storeData.deliveryFee}`}</p>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com o menu */}
      <main className={styles.mainContent}>
        <div className={styles.menuSection}>
          <input type="text" placeholder="Buscar no cardápio" className={styles.menuSearch} />
          {/* Itera sobre as categorias do menu vindas da API */}
          {storeData.menu.map(category => (
            <section key={category.name} className={styles.category}>
              <h2>{category.name}</h2>
              <div className={styles.itemsGrid}>
                {/* Itera sobre os itens de cada categoria */}
                {category.items.map(item => (
                  <MenuItem key={item.id} item={item} onSelect={setSelectedItem} />
                ))}
              </div>
            </section>
          ))}
        </div>
        {/* REMOVIDO: O <aside> com o <Cart /> estático foi removido */}
      </main>
    </>
  );
}
export default RestaurantPage;