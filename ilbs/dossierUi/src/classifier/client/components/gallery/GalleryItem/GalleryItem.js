/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import Image from "next/image";
import React from "react";

import excel from "../../../images/excel.png";
import libreOfficeCalc from "../../../images/libreOfficeCalc.png";
import libreOfficeDraw from "../../../images/libreOfficeDraw.png";
import libreOfficeImpress from "../../../images/libreOfficeImpress.png";
import libreOfficeMath from "../../../images/libreOfficeMath.png";
import libreOfficeWriter from "../../../images/libreOfficeWriter.png";
import word from "../../../images/word.png";
import DownloadButton from "../../DownloadButton";
import { Handle } from "../SortableGalleryItem/Handle";
import { ItemSelectionIndicator } from "../SortableGalleryItem/ItemSelectionIndicator";
import { Remove } from "../SortableGalleryItem/Remove";
/* eslint-enable n/no-missing-import -- Включение правила n/no-missing-import */

/**
 * Возвращает изображение для отображения на основе типа файла
 * @param {Object} src Источник документа
 * @param {Object} documents Документы
 * @param {string} dossierUrl
 * @returns {{path: string, hasNoPreview: boolean}|null} Объект с путем к изображению и флагом отсутствия предпросмотра
 */
const getImgFromSrc = (src, documents, dossierUrl) => {
  const previews = {
    "application/vnd.ms-excel": excel,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": excel,
    "application/docx": word,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": word,
    "application/msword": word,
    "application/vnd.oasis.opendocument.text": libreOfficeWriter,
    "application/vnd.oasis.opendocument.spreadsheet": libreOfficeCalc,
    "application/vnd.oasis.opendocument.presentation": libreOfficeImpress,
    "application/vnd.oasis.opendocument.graphics": libreOfficeDraw,
    "application/vnd.oasis.opendocument.formula": libreOfficeMath,
  };

  const documentType = Object.keys(documents).find(key =>
    documents[key].pages.find(pageItem => pageItem?.id === src?.id));

  const foundPage = documents[documentType]?.pages.find(pageItem => pageItem?.id === src?.id);

  if (foundPage?.type.includes("image/")) {
    return { path: `${dossierUrl}/${src.id}`, hasNoPreview: false };
  }

  if (previews[foundPage?.type]) {
    return { path: previews[foundPage?.type], hasNoPreview: true };
  }
  return null;
};

/* eslint-disable no-undefined -- Включение правила no-undefined */
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
        documents,
        dossierUrl,
      },
      ref,
    ) => {
      const img = getImgFromSrc(src, documents, dossierUrl);

      /**
       * Обработчик удаления элемента
       * @param {Event} event Событие
       * @returns {void}
       */
      const handleClick = event => {
        event.preventDefault();
        onRemove(src);
      };

      return (
        <div ref={ref} style={style}>
          <div
            className="segment"
            style={{
              margin: 4,
              cursor: `${dragOverlay ? "grabbing" : "grab"}`,
            }}>
            <div
              style={{
                border: "solid",
                borderWidth: 4,
                borderRadius: "0.28571429rem",
                borderColor: selected ? "#1677ff" : "transparent",
              }}>
              {/* todo проверка подписей, сделать без semantic-ui */}
              {/* {errors?.count && (*/}
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
              {/* )}*/}
              {/* {!disabled && <Handle dragOverlay={dragOverlay} {...listeners} />} */}
              {!disabled && img?.hasNoPreview && <DownloadButton src={src} />}
              {!disabled && img && !img?.hasNoPreview && <Handle onClick={onClick} />}
              {!disabled && <Remove onClick={handleClick} />}
              {!disabled && <ItemSelectionIndicator selected={selected} />}
              <div {...attributes} {...listeners}>
                {img && (
                  <Image
                    unoptimized
                    src={img?.path || img}
                    alt=""
                    width={260}
                    height={350}
                    // onClick={onClick}
                    onClick={onSelect}
                    // className="img-ofit"
                    objectFit={`${img?.hasNoPreview ? "contain" : undefined}`}
                    style={{
                      userSelect: "none",
                      MozUserSelect: "none",
                      WebkitUserSelect: "none",
                      WebkitUserDrag: "none",
                    }}
                  />
                )}
                {!disabled && img?.hasNoPreview && (
                  <div
                    style={{
                      width: "100%",
                      marginTop: "-22px",
                      overflow: "hidden",
                    }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "100%",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}>
                      {src.originalName}
                    </span>
                  </div>
                )}

                {!img && (
                  <div style={{ backgroundImage: "none" }}>
                    <div style={{ paddingTop: "51.5%", paddingBottom: "51.5%" }}>
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

GalleryItem.displayName = "GalleryItem";

export default GalleryItem;
/* eslint-enable no-undefined -- Включение правила no-undefined */
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
