import { useDroppable } from '@dnd-kit/core';
import { useDocuments } from '../../hooks';
import classNames from 'classnames';
import Popup from '../elements/Popup';
import { Alert, CheckSuccess, Question } from '../../icons/CustomIcons';
import { useEffect, useState } from 'react';

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
}) => {
  let className = '';
  let isNotImage = false;
  let isRequired = !document.readonly && document.required;
  const { documents } = useDocuments(uuid, dossierUrl);
  const tabDocuments = documents[document.type]?.pages;
  const countPages = tabDocuments?.length;
  if (countPages && !tabDocuments[0].type.includes('image/')) {
    isNotImage = true;
  }
  const { setNodeRef } = useDroppable({
    id: document.type,
    data: { tab: true },
    disabled: document.readonly || disabled || isNotImage,
  });

  if (error) className += ' error';
  if (document.readonly) className += 'readonly';

  // В зависимости от статуса отображать разные компоненты
  // LOADED - Зеленая галочка, по наведению текст "Документ загружен",
  // VALIDATION_ERROR -  Красный !, по наведению текст "Ошибка валидации" и ниже соджеражание массива documents[document.type]?.errors,
  // ON_AUTOMATIC_VERIFICATION - Подобрать символ что то типо желтых часов. По наведения отображать текст "Документ На автоматической проверке"
  // VERIFICATIONS_ERROR - Красный !. По наведения текст "Ошибки автоматической проверки" и ниже соджеражание массива documents[document.type]?.errors
  // VERIFICATION_SUCCESS -  Зеленая галочка, по наведению текст "Все автоматическое проверки прошли успешно"
  // ACCEPTED -  Зеленая галочка, по наведению текст "Документ актцептован на сделку"

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
            )}
            onClick={(e) => {
              if (!disabled) {
                onDocumentSelect(e, { name: document.type });
              }
            }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="icons" style={{ position: 'absolute', left: 8, display: 'flex' }}>
                {!!validationErrorMessage ? (
                  <Popup content={validationErrorMessage} trigger={<Alert />} />
                ) : (
                  <>
                    {documents[document.type]?.verificationResult && // Заменить на статус проверок
                      (documents[document.type]?.verificationResult === 'success' ? (
                        <Popup
                          content={'Все проверки завершены успешно'}
                          trigger={<CheckSuccess />}
                        />
                      ) : documents[document.type]?.errors ? (
                        <Popup content={documents[document.type]?.errors} trigger={<Alert />} />
                      ) : (
                        <></>
                      ))}
                  </>
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

              <div>
                <span>
                  {document.name} {countPages ? '(' + countPages + ')' : ''}
                </span>
              </div>
              {isRequired && (
                <div>
                  <span style={{ color: 'red' }}>*</span>{' '}
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
