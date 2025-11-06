import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import FeaturedCategoryCard from '../components/FeaturedCategoryCard';
import { categories } from '../data/categories'; // Este é o último mock que ainda usamos
import styles from '../App.module.css';
import searchStyles from '../components/SearchBar.module.css'; // Reutiliza o estilo da barra de pesquisa

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navega para a página de listagem com o termo de pesquisa
      navigate(`/restaurantes?q=${searchQuery}`);
    }
  };

  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Tudo para facilitar o seu dia a dia</h1>
        <p className={styles.heroSubtitle}>Peça e receba onde estiver</p>
        {/* Formulário de pesquisa funcional */}
        <form onSubmit={handleSearch} className={searchStyles.searchContainer}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Encontre restaurantes, mercados e mais"
            className={searchStyles.searchInput}
          />
          <button type="submit" className={searchStyles.searchButton}>Buscar</button>
        </form>
      </section>

      {/* Links agora apontam para a página de listagem por categoria */}
      <Link to="/restaurantes/refeicao" style={{ textDecoration: 'none', color: 'inherit' }}>
        <section className={styles.cardsContainer}>
          <FeaturedCategoryCard title="Refeição" />
        </section>
      </Link>
      <Link to="/restaurantes/alimentacao" style={{ textDecoration: 'none', color: 'inherit' }}>
         <section className={styles.cardsContainer}>
           <FeaturedCategoryCard title="Alimentação" />
        </section>
      </Link>

      <section>
        <h2 className={styles.sectionTitle}>Categorias</h2>
        <div className={styles.cardsContainer}>
          {/* Mapeia as categorias do mock 'categories.js' */}
          {categories.map((category) => (
             <Link key={category.id} to={category.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <CategoryCard 
                title={category.title} 
                description={category.description} 
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
export default HomePage;