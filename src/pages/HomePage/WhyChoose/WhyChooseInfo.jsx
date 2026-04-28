import styles from './styles.module.scss';
function WhyChooseInfo({ icon, title, desc }) {
  const { card, iconBox, titleText, description } = styles;
  const Icon = icon;
  return (
    <div className={card}>
      <div className={iconBox}>
        <Icon />
      </div>
      <h3 className={titleText}>{title}</h3>
      <p className={description}>{desc}</p>
    </div>
  );
}

export default WhyChooseInfo;
