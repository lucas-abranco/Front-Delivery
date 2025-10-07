import styles from './FeaturedCategoryCard.module.css';

function FeaturedCategoryCard({ title }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <button className={styles.button}>Ver opções</button>
    </div>
  );
}

export default FeaturedCategoryCard;