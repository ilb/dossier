import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import GalleryItem from './GalleryItem/GalleryItem';

const SortableGalleryItem = ({
  src,
  onRemove,
  onClick,
  disabled,
  errors,
  onSelect,
  selected,
  documents,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: src.id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    position: 'relative',
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
    />
  );
};

export default SortableGalleryItem;
