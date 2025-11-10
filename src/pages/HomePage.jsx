// Caminho: src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Caminhos corrigidos para corresponder à sua estrutura
import CategoryCard from '../components/CategoryCard/CategoryCard.jsx';
import FeaturedCategoryCard from '../components/FeaturedCategoryCard/FeaturedCategoryCard.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import styles from '../App.module.css'; // Usa o CSS global da App

// A URL base da nossa API de back-end
const API_URL = 'http://localhost:3000';

function HomePage() {
  const [categories, setCategories] = useState([]); // Estado para as categorias da API
  const [loading, setLoading] = useState(true);

  // Efeito para buscar as categorias da API quando a página carrega
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // 1. Chama a nova rota do back-end
        const response = await fetch(`${API_URL}/stores/categories`);
        if (!response.ok) throw new Error('Falha ao buscar categorias.');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []); // O array vazio [] garante que isto só corre uma vez

  return (
    <main className={styles.mainContainer}>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Tudo para facilitar o seu dia a dia</h1>
        <p className={styles.heroSubtitle}>Peça e receba onde estiver</p>
        {/* O SearchBar é um componente autónomo que já tem a sua lógica */}
        <SearchBar />
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
          {/* 2. Mapeia as categorias vindas do 'useState' (API) */}
          {loading ? (
            <p>A carregar categorias...</p>
          ) : (
            categories.map((category) => (
              <Link key={category.id} to={category.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <CategoryCard 
                  title={category.title} 
                  description={category.description} 
                />
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
export default HomePage;