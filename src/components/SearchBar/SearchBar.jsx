import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // A lógica de pesquisa agora vive dentro do próprio componente
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navega para a página de listagem com o termo de pesquisa
      navigate(`/restaurantes?q=${searchQuery}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={styles.searchContainer}>
      <input 
        type="text" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Encontre restaurantes, mercados e mais" 
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;