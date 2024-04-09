import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Handle } from '../SortableGalleryItem/Handle';
import { Remove } from '../SortableGalleryItem/Remove';

import excel from '../../../../../../public/images/excel.png';
import word from '../../../../../../public/images/word.png';
import libreOfficeWriter from '../../../../../../public/images/libreOfficeWriter.png';
import libreOfficeCalc from '../../../../../../public/images/libreOfficeCalc.png';
import libreOfficeImpress from '../../../../../../public/images/libreOfficeImpress.png';
import libreOfficeDraw from '../../../../../../public/images/libreOfficeDraw.png';
import libreOfficeMath from '../../../../../../public/images/libreOfficeMath.png';

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
      // const [isImagePreviewView, setIsImagePreviewView] = useState(false);
      const [nonImagePreview, setNonImagePreview] = useState(null);
      const [isImage, setIsImage] = useState(true);

      useEffect(() => {
        if (src.type) {
          if (!src.type.includes('image/')) {
            const preview = getNonImagePreview(src.type);
            setNonImagePreview(preview);
            setIsImage(false);
          }
          // setIsImagePreviewView(true);
        }
      }, []);

      const handleClick = (event) => {
        event.preventDefault();
        onRemove(src);
      };

      const getNonImagePreview = (type) => {
        const previews = {
          'application/vnd.ms-excel': excel,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': excel,
          'application/docx': word,
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': word,
          'application/msword': word,
          'application/vnd.oasis.opendocument.text': libreOfficeWriter,
          'application/vnd.oasis.opendocument.spreadsheet': libreOfficeCalc,
          'application/vnd.oasis.opendocument.presentation': libreOfficeImpress,
          'application/vnd.oasis.opendocument.graphics': libreOfficeDraw,
          'application/vnd.oasis.opendocument.formula': libreOfficeMath,
        };

        return previews[type];
      };

      return (
        <div ref={ref} style={style}>
          <div
            className="segment"
            style={{ margin: 3, cursor: `${dragOverlay ? 'grabbing' : 'grab'}` }}>
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
              {/* {!disabled && <Handle dragOverlay={dragOverlay} {...listeners} />} */}
              {!disabled && isImage && <Handle onClick={onClick} />}
              {!disabled && <Remove onClick={handleClick} />}
              <div {...attributes} {...listeners}>
                {isImage && (
                  <Image
                    unoptimized
                    src={src.path || src}
                    alt="alt"
                    width={260}
                    height={350}
                    // onClick={onClick}
                    className="img-ofit"
                    style={{
                      userSelect: 'none',
                      MozUserSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitUserDrag: 'none',
                    }}
                  />
                )}
                {!isImage &&
                  (nonImagePreview ? (
                    <Image
                      unoptimized
                      src={nonImagePreview}
                      alt="alt"
                      width={260}
                      height={350}
                      // onClick={onClick}
                      className="img-ofit"
                      style={{
                        userSelect: 'none',
                        MozUserSelect: 'none',
                        WebkitUserSelect: 'none',
                        WebkitUserDrag: 'none',
                      }}
                    />
                  ) : (
                    <div style={{ backgroundImage: 'none' }}>
                      <div style={{ paddingTop: '51.5%', paddingBottom: '51.5%' }}>
                        Невозможно отобразить или переместить. Документ не является картинкой.
                      </div>
                    </div>
                  ))}
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
