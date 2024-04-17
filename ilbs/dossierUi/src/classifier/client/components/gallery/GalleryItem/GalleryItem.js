import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Handle } from '../SortableGalleryItem/Handle';
import { Remove } from '../SortableGalleryItem/Remove';
import DownloadButton from '../../DownloadButton';

import excel from '../../../images/excel.png';
import word from '../../../images/word.png';
import libreOfficeWriter from '../../../images/libreOfficeWriter.png';
import libreOfficeCalc from '../../../images/libreOfficeCalc.png';
import libreOfficeImpress from '../../../images/libreOfficeImpress.png';
import libreOfficeDraw from '../../../images/libreOfficeDraw.png';
import libreOfficeMath from '../../../images/libreOfficeMath.png';

const getImgFromSrc = (src, documents) => {
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

  const documentType = Object.keys(documents).find((key) =>
    documents[key].pages.find((page) => page?.id === src?.id),
  );

  const page = documents[documentType]?.pages.find((page) => page?.id === src?.id);

  if (page?.type.includes('image/')) {
    return { path: src.id, hasNoPreview: false };
  }

  if (previews[page?.type]) {
    return { path: previews[page?.type], hasNoPreview: true };
  }

  return;
};

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
        documents,
      },
      ref,
    ) => {
      const img = getImgFromSrc(src, documents);

      const handleClick = (event) => {
        event.preventDefault();
        onRemove(src);
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
              {!disabled && img?.hasNoPreview && <DownloadButton src={src} />}
              {!disabled && img && !img?.hasNoPreview && <Handle onClick={onClick} />}
              {!disabled && <Remove onClick={handleClick} />}
              <div {...attributes} {...listeners}>
                {img && (
                  <Image
                    unoptimized
                    // src={src?.path || src}
                    src={img?.path || img}
                    alt=""
                    width={260}
                    height={350}
                    objectFit={`${img?.hasNoPreview ? 'contain' : undefined}`}
                    style={{
                      userSelect: 'none',
                      MozUserSelect: 'none',
                      WebkitUserSelect: 'none',
                      WebkitUserDrag: 'none',
                    }}
                  />
                )}

                {!img && (
                  <div style={{ backgroundImage: 'none' }}>
                    <div style={{ paddingTop: '51.5%', paddingBottom: '51.5%' }}>
                      Невозможно отобразить или переместить. Документ не является изображением.
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
