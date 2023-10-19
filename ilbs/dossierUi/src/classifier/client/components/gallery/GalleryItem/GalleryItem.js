import React, { useEffect } from 'react';
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
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return;
        }
        document.body.style.cursor = 'grabbing';
        return () => {
          document.body.style.cursor = '';
        };
      }, [dragOverlay]);
      const handleClick = (event) => {
        event.preventDefault();
        onRemove(src);
      };

      const isImage = () => {
        return src.type ? src.type.includes('image/') : true;
      };

      const getPath = () => src.path || src; // todo как-то избавиться от такого
      return (
        <div ref={ref} style={style}>
          <div className="segment" style={{ margin: 3 }}>
            <div style={{ padding: 4 }}>
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
              {!disabled && <Handle {...listeners} />}
              {!disabled && <Remove onClick={handleClick} />}
              <div {...attributes}>
                {isImage() && (
                  <img
                    src={getPath()}
                    quality={10}
                    onClick={onClick}
                    className="img-ofit"
                    style={{
                      width: '100%',
                      height: '100%',
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
