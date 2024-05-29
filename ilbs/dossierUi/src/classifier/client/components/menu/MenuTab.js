import { useDroppable } from '@dnd-kit/core';
import { useDocuments } from '../../hooks';
import classNames from 'classnames';
import Popup from '../elements/Popup';
import { Alert, CheckSuccess, Question, Hourglass } from '../../icons/CustomIcons';

const statuses = {
  LOADED: 'Документ загружен',
  VALIDATION_ERROR: 'Ошибка валидации',
  ON_AUTOMATIC_VERIFICATION: 'Документ на автоматической проверке',
  VERIFICATIONS_ERROR: 'Ошибки автоматической проверки',
  VERIFICATION_SUCCESS: 'Все автоматические проверки прошли успешно',
  ACCEPTED: 'Документ акцептован на сделку',
};

const getStatusToShow = (status = '', errors = '') => {
  const statusToShow = {};

  switch (status) {
    case 'LOADED':
      statusToShow.content = statuses.LOADED;
      statusToShow.icon = <CheckSuccess />;
      break;
    case 'VALIDATION_ERROR':
      statusToShow.content = `${statuses.VALIDATION_ERROR}: \n ${errors}`;
      statusToShow.icon = <Alert />;
      break;
    case 'ON_AUTOMATIC_VERIFICATION':
      statusToShow.content = statuses.ON_AUTOMATIC_VERIFICATION;
      statusToShow.icon = <Hourglass />;
      break;
    case 'VERIFICATIONS_ERROR':
      statusToShow.content = `${statuses.VERIFICATIONS_ERROR}: \n ${errors}`;
      statusToShow.icon = <Alert />;
      break;
    case 'VERIFICATION_SUCCESS':
      statusToShow.content = statuses.VERIFICATION_SUCCESS;
      statusToShow.icon = <CheckSuccess />;
      break;
    case 'ACCEPTED':
      statusToShow.content = statuses.ACCEPTED;
      statusToShow.icon = <CheckSuccess />;
      break;
  }

  return statusToShow;
};

const MenuTab = ({
  uuid,
  document,
  selected,
  disabled,
  onDocumentSelect,
  error,
  hidden,
  validationErrorMessage,
  dossierUrl,
  isVersionOpened,
  setIsVersionOpened,
  collapsed,
  context,
}) => {
  let className = '';
  // let isNotImage = false;
  let isRequired = !document.readonly && document.required;
  const { documents } = useDocuments(uuid, dossierUrl, context);
  const tabDocuments = documents[document.type]?.pages;
  const countPages = tabDocuments?.length;

  // if (countPages && !tabDocuments[0].type.includes('image/')) {
  //   isNotImage = true;
  // }

  const { setNodeRef, isOver } = useDroppable({
    id: document.type,
    data: { tab: true },
    disabled: document.readonly || disabled,
  });

  if (error) className += ' error';
  if (document.readonly) className += 'readonly';

  const errors = documents[document.type]?.errors;
  const currentStatus = documents[document.type]?.state;
  const statusToShow = getStatusToShow(currentStatus, errors);

  return (
    <div id={document.type}>
      {!hidden && (
        <div key={document.type} ref={setNodeRef}>
          <div
            className={classNames(
              className,
              'menuItem',
              'menuItemTab',
              selected && 'menuItemSelected',
              disabled && 'menuItemDisabled',
              selected && isOver && 'menuItemTargeted ',
            )}
            onClick={(e) => {
              if (!disabled) {
                onDocumentSelect(e, { name: document.type });
              }
            }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <div className="icons" style={{ display: 'flex', minWidth: '44px' }}>
                {!!validationErrorMessage ? (
                  <Popup content={validationErrorMessage} trigger={<Alert />} />
                ) : (
                  currentStatus && (
                    <Popup content={statusToShow.content} trigger={statusToShow.icon} />
                  )
                )}

                {document.tooltip && <Popup content={document.tooltip} trigger={<Question />} />}
              </div>

              {collapsed && (
                <div
                  onClick={() => setIsVersionOpened(!isVersionOpened)}
                  style={{ cursor: 'pointer', marginRight: '10px' }}>
                  {isVersionOpened && <i className="iconChevronUp icon" />}
                  {!isVersionOpened && <i className="iconChevronDown icon" />}
                </div>
              )}

              <div
                style={{
                  width: '100%',
                  marginLeft: '5px',
                  textAlign: 'left',
                }}>
                <span lang="ru" style={{ hyphens: 'auto' }}>
                  {document.name} {countPages ? '(' + countPages + ')' : ''}
                </span>
              </div>
              {isRequired && (
                <div style={{ alignSelf: 'flex-start' }}>
                  <span style={{ color: 'red' }}>*</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuTab;
