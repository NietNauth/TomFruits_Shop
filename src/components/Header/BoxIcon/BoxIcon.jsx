import styles from '../styles.module.scss';
import cart from '@icons/svgs/cart.svg';
function BoxIcon({ type /*href*/ }) {
  const { boxIcon } = styles;
  const handleRenderIcon = () => {
    return cart;
  };
  return (
    <div className={boxIcon}>
      <img src={handleRenderIcon(type)} alt={type} />
    </div>
  );
}

export default BoxIcon;
