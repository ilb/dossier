import React from 'react';
import Image from 'next/image';

import { Handle } from '../SortableGalleryItem/Handle';
import { Remove } from '../SortableGalleryItem/Remove';

const GalleryItem = React.memo(
  React.forwardRef(
    (
      {
        src,
        width,
        height,
        dragOverlay,
        style,
        disabled,
        onRemove,
        onClick,
        attributes,
        listeners,
        errors,
        onSelect,
        selected,
      },
      ref,
    ) => {
      const handleClick = (event) => {
        event.preventDefault();
        onRemove(src);
      };

      const isImage = () => {
        return src.type ? src.type.includes('image/') : true;
      };

      return (
        <div ref={ref} style={style}>
          <div
            className="segment"
            style={{
              margin: 4,
              cursor: `${dragOverlay ? 'grabbing' : 'grab'}`,
            }}>
            <div
              style={{
                // padding: 4,
                border: 'solid',
                borderWidth: 4,
                borderRadius: '0.28571429rem',
                borderColor: selected ? '#1677ff' : 'transparent',
              }}>
              {/* todo проверка подписей, сделать без semantic-ui */}
              {/*{errors?.count && (*/}
              {/*  <Popup*/}
              {/*    trigger={*/}
              {/*      <Icon*/}
              {/*        style={{ display: 'block', position: 'absolute', zIndex: 10, margin: 10 }}*/}
              {/*        size="large"*/}
              {/*        color="red"*/}
              {/*        name="attention"*/}
              {/*      />*/}
              {/*    }>*/}
              {/*    <div>*/}
              {/*      {errors.description ? 'Отсутствует:' : 'Отсутствует подписей: ' + errors.count}*/}
              {/*    </div>*/}
              {/*    {errors.description.split('\n').map((error) => (*/}
              {/*      <div>{error}</div>*/}
              {/*    ))}*/}
              {/*  </Popup>*/}
              {/*)}*/}
              {/* {!disabled && <Handle dragOverlay={dragOverlay} {...listeners} />} */}
              {!disabled && <Handle onClick={onClick} />}
              {!disabled && <Remove onClick={handleClick} />}
              <div {...attributes} {...listeners}>
                {isImage() && (
                  <Image
                    unoptimized
                    src={src.path}
                    alt=""
                    width={260}
                    height={350}
                    // onClick={onClick}
                    onClick={onSelect}
                    // className="img-ofit"
                    style={{
                      userSelect: 'none',
                      MozUserSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitUserDrag: 'none',
                    }}
                  />
                )}
                {!isImage() && (
                  <div style={{ backgroundImage: 'none' }}>
                    <div style={{ paddingTop: '51.5%', paddingBottom: '51.5%' }}>
                      Невозможно отобразить или переместить. Документ не является картинкой.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
  ),
);

GalleryItem.displayName = 'GalleryItem';

export default GalleryItem;
