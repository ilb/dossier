/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import { DragOverlay } from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";

import ControlsMenu from "./GalleryItem/ControlsMenu.js";
import GalleryItem from "./GalleryItem/GalleryItem.js";
import SegmentItem from "./GalleryItem/SegmentItem.js";
import SortableGalleryItem from "./SortableGalleryItem.js";


/**
 * Возвращает номер страницы
 * @param {string} id ID страницы
 * @param {Object[]} pages Массив страниц
 * @returns {number|null} Номер страницы или null
 */
const getPageNum = (id, pages) => {
  const pageNum = pages.findIndex(page => page.id === id) + 1;

  return pageNum === -1 ? null : pageNum;
};

const initState = {
  currentPage: null,
  scale: 1,
  rotation: 0,
  src: "",
  previewOpen: false,
};

/**
 * Компонент сортируемой галереи
 * @param {Object} root0 Свойства компонента
 * @param {Object[]} root0.srcSet Набор изображений
 * @param {Object} root0.active Активное изображение
 * @param {Function} root0.onRemove Функция для удаления изображения
 * @param {Object} root0.tab Объект вкладки
 * @param {Object} root0.pageErrors Ошибки страниц
 * @param {boolean} root0.disabled Отключение взаимодействия
 * @param {string[]} root0.selectedIds Массив выбранных ID изображений
 * @param {Function} root0.handleSelect Функция для обработки выбора изображений
 * @param {Object[]} root0.documents Документы, связанные с изображениями
 * @returns {JSX.Element} Сортируемая галерея
 */
const SortableGallery = ({
  srcSet,
  active,
  onRemove,
  tab,
  pageErrors,
  disabled,
  selectedIds,
  handleSelect,
  documents,
}) => {
  const [state, setState] = useState(initState);

  const itemCount = selectedIds.length;

  useEffect(() => {
    setState({ ...state, previewOpen: false });
  }, [tab?.type]);

  useEffect(() => {
    setState(initState);
  }, [tab?.name]);

  const pagesWithPreview = srcSet.filter(item => item?.type.includes("image/"));
  const pageCount = pagesWithPreview.length;

  /**
   * Переход по страницам
   * @param {string} direction Направление перехода ('prev' или 'next')
   * @returns {void}
   */
  const navigatePage = direction => {
    if (direction === "prev" && state.currentPage > 1) {
      setState({
        ...state,
        rotation: 0,
        currentPage: state.currentPage - 1,
        src: pagesWithPreview[state.currentPage - 2].id,
      });
    } else if (direction === "next" && state.currentPage < pageCount) {
      setState({
        ...state,
        rotation: 0,
        currentPage: state.currentPage + 1,
        src: pagesWithPreview[state.currentPage].id,
      });
    }
  };

  /**
   * Вращение изображения
   * @param {Event} event Событие вращения
   * @param {Object} root0 Параметры вращения
   * @param {number} root0.angle Угол поворота
   * @returns {void}
   */
  const rotateImage = async (event, { angle }) => {
    let newAngle = state.rotation + angle;

    if (newAngle < 0) {
      newAngle = 270;
    }
    if (newAngle > 270) {
      newAngle = 0;
    }

    setState({ ...state, rotation: newAngle });
  };

  /**
   * Увеличение изображения
   * @param {Event} event Событие увеличения
   * @param {Object} root0 Параметры увеличения
   * @param {number} root0.scaleNum Коэффициент увеличения
   * @returns {void}
   */
  const zoomImageIn = async (event, { scaleNum }) => {
    const newScale = Math.min(10, Math.ceil((scaleNum * 1.1) * 10) / 10);
    const newWidth = state.width * newScale;
    const newHeight = state.height * newScale;

    setState({ ...state, scale: newScale, width: newWidth, height: newHeight });
  };

  /**
   * Уменьшение изображения
   * @param {Event} event Событие уменьшения
   * @param {Object} root0 Параметры уменьшения
   * @param {number} root0.scaleNum Коэффициент уменьшения
   * @returns {void}
   */
  const zoomImageOut = async (event, { scaleNum }) => {
    const newScale = Math.max(0.1, Math.ceil((scaleNum / 1.1) * 10) / 10);
    const newWidth = state.width / newScale;
    const newHeight = state.height / newScale;

    setState({ ...state, scale: newScale, width: newWidth, height: newHeight });
  };

  /**
   * Увеличение изображения через dropdown
   * @param {number} value Значение увеличения
   * @returns {void}
   */
  const zoomImageWithDropdown = async value => {
    const newWidth = 460 * value;
    const newHeight = 600 * value;

    setState({ ...state, scale: value, width: newWidth, height: newHeight });
  };

  return (
    <>
      <SortableContext items={srcSet} strategy={rectSortingStrategy}>
        {state.previewOpen && (
          <ControlsMenu
            pageCount={pageCount}
            currentPage={state.currentPage}
            navigatePage={navigatePage}
            attached="top"
            rotateImage={rotateImage}
            zoomImageIn={zoomImageIn}
            zoomImageOut={zoomImageOut}
            closePreview={() =>
              setState({
                ...state,
                rotation: 0,
                scale: 1,
                previewOpen: false,
                src: null,
              })
            }
            zoomImageWithDropdown={zoomImageWithDropdown}
            scale={state.scale}
          />
        )}

        <div className="pagePreviewer">
          {!state.previewOpen && (
            <div className="grid">
              {srcSet.map(src => (
                <div key={src.id} className="column">
                  <SortableGalleryItem
                    documents={documents}
                    src={src}
                    errors={pageErrors[src.uuid]}
                    disabled={disabled || tab.readonly}
                    onRemove={onRemove}
                    onClick={() => {
                      setState({
                        ...state,
                        previewOpen: true,
                        src: src.id,
                        // currentPage: getPageNumFromImageId(src.id),
                        currentPage: getPageNum(src.id, pagesWithPreview),
                      });
                    }}
                    onSelect={e => handleSelect(src.id)}
                    selected={selectedIds.includes(src.id)}
                  />
                </div>
              ))}
            </div>
          )}

          {state.previewOpen && (
            <SegmentItem
              src={state.src}
              rotation={state.rotation}
              scale={state.scale}
              width={state.width}
              height={state.height}
            />
          )}
        </div>
      </SortableContext>

      <DragOverlay style={{ position: "relative" }}>
        {itemCount > 1 && <div className="item-count">{itemCount}</div>}

        {active ? (
          <GalleryItem
            // src={getOverlayPreview(active)}
            src={active}
            style={{ backgroundColor: "#ffffff", opacity: 0.2 }}
            dragOverlay={true}
            documents={documents}
          />
        ) : null}
      </DragOverlay>
    </>
  );
};

export default SortableGallery;
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
