/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import ListItem from "./GalleryItem/ListItem.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

/**
 * Компонент галереи в виде списка
 * @param {Object} root0 Свойства компонента
 * @param {Object[]} root0.srcSet Массив изображений
 * @returns {JSX.Element} Галерея в виде списка
 */
const ListGallery = ({ srcSet }) => (
  <>
    <div className="classifier-list-gallery">
      {srcSet.map(item => <ListItem key={item.id} src={item.path} rotation={0} scale={1} />)}
    </div>
  </>
);

export default ListGallery;
