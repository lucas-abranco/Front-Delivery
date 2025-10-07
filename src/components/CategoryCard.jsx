import styles from './CategoryCard.module.css';

// O componente recebe "title" e "description" como propriedades (props)
function CategoryCard({ title, description }) {
  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder}></div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}

export default CategoryCard;