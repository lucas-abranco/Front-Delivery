import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import FeaturedCategoryCard from '../components/FeaturedCategoryCard';
import SearchBar from '../components/SearchBar';
import { categories } from '../data/categories';
import styles from '../App.module.css';

function HomePage() {
  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Tudo para facilitar o seu dia a dia</h1>
        <p className={styles.heroSubtitle}>Peça e receba onde estiver</p>
        <SearchBar />
      </section>

      {/* Este link agora aponta para um restaurante específico */}
      <Link to="/restaurante/pizzaria-bella" style={{ textDecoration: 'none', color: 'inherit' }}>
        <section className={styles.cardsContainer}>
          <FeaturedCategoryCard title="Refeição" />
          <FeaturedCategoryCard title="Alimentação" />
        </section>
      </Link>

      <section>
        <h2 className={styles.sectionTitle}>Categorias</h2>
        <div className={styles.cardsContainer}>
          {/* Mapeamos as categorias e usamos o 'path' de cada uma para criar o link */}
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

