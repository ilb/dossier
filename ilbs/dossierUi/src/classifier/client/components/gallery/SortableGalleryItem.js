/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import GalleryItem from "./GalleryItem/GalleryItem.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

/**
 * Компонент сортируемого элемента галереи
 * @param {Object} root0 Свойства компонента
 * @param {Object} root0.src Источник изображения
 * @param {Function} root0.onRemove Функция для удаления элемента
 * @param {Function} root0.onClick Функция для обработки клика по элементу
 * @param {boolean} root0.disabled Флаг отключения элемента
 * @param {Object[]} root0.errors Ошибки, связанные с элементом
 * @param {Function} root0.onSelect Функция для выбора элемента
 * @param {boolean} root0.selected Флаг выбора элемента
 * @param {Object[]} root0.documents Список документов, связанных с элементом
 * @returns {JSX.Element} Компонент сортируемого элемента галереи
 */
const SortableGalleryItem = ({
  src,
  onRemove,
  onClick,
  disabled,
  errors,
  onSelect,
  selected,
  documents,
  dossierUrl
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: src.id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: "relative",
    zIndex: 100,
  };

  return (
    <GalleryItem
      src={src}
      ref={setNodeRef}
      style={style}
      disabled={disabled}
      onRemove={onRemove}
      onClick={onClick}
      attributes={attributes}
      listeners={listeners}
      errors={errors}
      onSelect={onSelect}
      selected={selected}
      documents={documents}
      dossierUrl={dossierUrl}
    />
  );
};

export default SortableGalleryItem;
