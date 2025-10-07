import styles from './SearchBar.module.css';

function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <input 
        type="text" 
        placeholder="Endereço de entrega e número" 
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>
        Buscar
      </button>
    </div>
  );
}

export default SearchBar;
