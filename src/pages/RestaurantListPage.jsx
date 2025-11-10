// Caminho: src/pages/RestaurantListPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// Importa o componente de cartão (subindo um nível para 'components')
import RestaurantCard from '../components/RestaurantCard/RestaurantCard';
import styles from './RestaurantListPage.module.css';

const API_URL = 'http://localhost:3000';

function RestaurantListPage() {
  // Obtém parâmetros da URL (ex: 'refeicao' de /restaurantes/refeicao)
  const { category } = useParams();
  const location = useLocation();
  // Obtém parâmetros de query (ex: 'pizza' de ?q=pizza)
  const searchQuery = new URLSearchParams(location.search).get('q');

  const [restaurants, setRestaurants] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  // Efeito para buscar os dados da API
  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      let fetchUrl = `${API_URL}/stores`; // Rota do back-end para buscar todos
      let pageTitle = 'Estabelecimentos Disponíveis';

      if (category) {
        pageTitle = `Restaurantes: ${category}`;
      } else if (searchQuery) {
        pageTitle = `Resultados para "${searchQuery}"`;
      }
      setTitle(pageTitle);

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Falha ao buscar restaurantes.');
        const data = await response.json();
        
        // --- FILTRO NO FRONT-END ---
        // (O ideal é que o back-end fizesse isto, mas é uma solução funcional)
        let filteredData = data;
        
        // 1. Filtra por categoria
        if (category) {
          filteredData = data.filter(r => r.category === category);
        }
        // 2. Filtra por termo de pesquisa (nome ou tipo de cozinha)
        if (searchQuery) {
          filteredData = data.filter(r => 
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.cuisine && r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        }
        
        setRestaurants(filteredData);
      } catch (error) {
        console.error(error.message);
        setRestaurants([]);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, [category, searchQuery]); // Re-executa se a categoria ou a pesquisa mudar

  if (loading) {
    return <div className={styles.pageContainer}>A carregar estabelecimentos...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>{title}</h1>
      {restaurants.length > 0 ? (
        <div className={styles.listGrid}>
          {/* Renderiza um cartão para cada restaurante encontrado */}
          {restaurants.map(restaurant => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <p>Nenhum restaurante encontrado.</p>
      )}
    </div>
  );
}

export default RestaurantListPage;