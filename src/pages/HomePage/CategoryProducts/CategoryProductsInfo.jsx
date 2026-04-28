import styles from './styles.module.scss';
function CategoryProductsInfo({ content, description, img }) {
  console.log(content, description, img);
  const { card, image, contentBox, title } = styles;
  return (
    <div className={card}>
      <div className={image}>
        <img src={img} alt={content} />
      </div>
      <div className={contentBox}>
        <div className={title}>{content}</div>
      </div>
    </div>
  );
}

export default CategoryProductsInfo;
