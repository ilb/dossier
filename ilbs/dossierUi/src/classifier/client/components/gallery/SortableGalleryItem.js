import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GalleryItem from './GalleryItem/GalleryItem';

const SortableGalleryItem = ({ src, width, height, onRemove, onClick, disabled, errors }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: src.id,
    disabled: !src.type.includes('image/') || disabled
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
    zIndex: 100
  };

  return (
    <GalleryItem
      src={src}
      width={width}
      height={height}
      ref={setNodeRef}
      style={style}
      disabled={disabled}
      onRemove={onRemove}
      onClick={onClick}
      attributes={attributes}
      listeners={listeners}
      errors={errors}
    />
  );
};

export default SortableGalleryItem;
