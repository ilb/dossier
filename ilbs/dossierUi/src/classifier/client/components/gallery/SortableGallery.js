import { DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import GalleryItem from './GalleryItem/GalleryItem';
import SortableGalleryItem from './SortableGalleryItem';
import SegmentItem from './GalleryItem/SegmentItem';
import React, { useEffect, useState } from 'react';
import ControlsMenu from './GalleryItem/ControlsMenu';

// const getPageNumFromImageId = (id) => {
//   console.log('getPage id: ', id);

//   const match = id.match(/number\/(\d+)/);

//   if (match && match[1]) {
//     return parseInt(match[1], 10);
//   }

//   return null;
// };

const getPageNum = (id, pages) => {
  const pageNum = pages.findIndex((page) => page.id === id) + 1;

  return pageNum === -1 ? null : pageNum;
};

const initState = {
  currentPage: null,
  scale: 1,
  rotation: 0,
  src: '',
  previewOpen: false,
};

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

  const pagesWithPreview = srcSet.filter((item) => item?.type.includes('image/'));
  const pageCount = pagesWithPreview.length;

  const navigatePage = (direction) => {
    if (direction === 'prev' && state.currentPage > 1) {
      setState({
        ...state,
        rotation: 0,
        currentPage: state.currentPage - 1,
        src: pagesWithPreview[state.currentPage - 2].id,
      });
    } else if (direction === 'next' && state.currentPage < pageCount) {
      setState({
        ...state,
        rotation: 0,
        currentPage: state.currentPage + 1,
        src: pagesWithPreview[state.currentPage].id,
      });
    }
  };

  const rotateImage = async (event, { angle }) => {
    let newAngle = state.rotation + angle;
    if (newAngle < 0) {
      newAngle = 270;
    }
    if (newAngle > 270) {
      newAngle = 0;
    }
    const rotate = newAngle;
    setState({ ...state, rotation: rotate });
  };

  const zoomImageIn = async (event, { scaleNum }) => {
    let newScale = (scaleNum * 1.1).toFixed(2);
    newScale = Math.ceil(newScale * 10) / 10;
    newScale = Math.min(10, newScale);
    const newWidth = state.width * newScale;
    const newHeight = state.height * newScale;
    setState({ ...state, scale: newScale, width: newWidth, height: newHeight });
  };

  const zoomImageOut = async (event, { scaleNum }) => {
    let newScale = (scaleNum / 1.1).toFixed(2);
    newScale = Math.ceil(newScale * 10) / 10;
    newScale = Math.max(0.1, newScale);
    const newWidth = state.width / newScale;
    const newHeight = state.height / newScale;
    setState({ ...state, scale: newScale, width: newWidth, height: newHeight });
  };

  const zoomImageWithDropdown = async (value) => {
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
              {srcSet.map((src) => (
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
                    onSelect={(e) => handleSelect(src.id)}
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

      <DragOverlay style={{ position: 'relative' }}>
        {itemCount > 1 && <div className="item-count">{itemCount}</div>}

        {active ? (
          <GalleryItem
            // src={getOverlayPreview(active)}
            src={active}
            style={{ backgroundColor: '#ffffff', opacity: 0.2 }}
            dragOverlay={true}
            documents={documents}
          />
        ) : null}
      </DragOverlay>
    </>
  );
};

export default SortableGallery;
