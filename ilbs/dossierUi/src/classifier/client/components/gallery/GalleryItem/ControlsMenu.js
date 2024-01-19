import React from 'react';
import PropTypes from 'prop-types';

function ControlsMenu({
  pageCount,
  currentPage,
  navigatePage,
  rotateImage,
  zoomImageIn,
  zoomImageOut,
  closePreview,
  zoomImageWithDropdown,
  scale,
}) {
  return (
    <>
      <div className="file-dossier-file-controls controlsMenu">
        <div className="menuItem menuItemHorizontal minusItem">
          <button
            className="navBtn"
            onClick={(e) => {
              zoomImageOut(e, { scaleNum: scale });
            }}>
            <i className="icon iconMinus" />
          </button>
        </div>

        <div className="menuItem menuItemHorizontal plusItem">
          <button
            className="navBtn"
            onClick={(e) => {
              zoomImageIn(e, { scaleNum: scale });
            }}>
            <i className="icon iconPlus" />
          </button>
        </div>

        <div className="menuItemHorizontal zoomDropdownWrapper">
          <div className="zoomCounter">{(scale * 100).toFixed()}%</div>
          <select
            className="zoomDropdown"
            onChange={(e) => {
              zoomImageWithDropdown(e.target.value);
            }}>
            <option value="0.5">50%</option>
            <option value="0.75">75%</option>
            <option value="1">100%</option>
            <option value="1.25">125%</option>
            <option value="1.5">150%</option>
            <option value="2">200%</option>
            <option value="3">300%</option>
            <option value="4">400%</option>
          </select>
        </div>

        {pageCount > 1 && (
          <div className="menuItem menuItemHorizontal pageNavigation">
            <button
              className="navBtn"
              onClick={() => navigatePage('prev')}
              disabled={currentPage === 1}>
              <i className="icon iconLeft" />
            </button>

            <div className="page-counter">
              <b>{currentPage}</b>
            </div>

            <button
              className="navBtn"
              onClick={() => navigatePage('next')}
              disabled={currentPage === pageCount}>
              <i className="icon iconRight" />
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            marginLeft: 'auto',
          }}>
          <div className="menuItem menuItemHorizontal undoItem">
            <button
              className="navBtn"
              onClick={(e) => {
                rotateImage(e, { angle: -90 });
              }}>
              <i className="icon iconUndo" />
            </button>
          </div>

          <div className="menuItem menuItemHorizontal redoItem">
            <button
              className="navBtn"
              onClick={(e) => {
                rotateImage(e, { angle: 90 });
              }}>
              <i className="icon iconRedo" />
            </button>
          </div>

          <div className="menuItem menuItemHorizontal">
            <button className="navBtn" onClick={closePreview}>
              <i className="icon iconClose" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

ControlsMenu.propTypes = {
  src: PropTypes.string,
  scaleNum: PropTypes.number,
};

export default ControlsMenu;
