import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import RestaurantCard from './RestaurantPage.jsx';
import styles from './RestaurantListPage.module.css';

const API_URL = 'http://localhost:3000';

function RestaurantListPage() {
  const { category } = useParams();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  const [restaurants, setRestaurants] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      
      let fetchUrl = `${API_URL}/stores`;
      
      if (category) {
        setTitle(`Restaurantes de ${category}`);
        // NOTA: O nosso back-end atual (GET /stores) ainda não filtra por categoria.
        // Numa próxima versão, poderíamos mudar a URL para:
        // fetchUrl = `${API_URL}/stores?category=${category}`;
      } else if (searchQuery) {
        setTitle(`Resultados para "${searchQuery}"`);
        // NOTA: O nosso back-end atual também não filtra por pesquisa.
        // fetchUrl = `${API_URL}/stores?q=${searchQuery}`;
      } else {
        setTitle('Estabelecimentos Disponíveis');
      }

      try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error('Falha ao buscar restaurantes.');
        
        const data = await response.json();
        
        // Filtro temporário no front-end
        let filteredData = data;
        if (category) {
          filteredData = data.filter(r => r.category === category);
        }
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
  }, [category, searchQuery]);

  if (loading) {
    return <div className={styles.pageContainer}>A carregar estabelecimentos...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1>{title}</h1>
      {restaurants.length > 0 ? (
        <div className={styles.listGrid}>
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

