import styles from '../styles.module.scss';
function InfoCard({ content, description, src }) {
  console.log(content, description, src);
  const { containerCard, containerContent, title, des } = styles;
  return (
    <div className={containerCard}>
      <img width={40} height={41} src={src} alt='truck' />
      <div className={containerContent}>
        <div className={title}>{content}</div>
        <div className={des}>{description}</div>
      </div>
    </div>
  );
}

export default InfoCard;
