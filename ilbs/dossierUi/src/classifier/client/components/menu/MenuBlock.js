import MenuTab from './MenuTab';
import { useState } from 'react';

const MenuBlock = ({
  uuid,
  block,
  selected,
  hiddenTabs,
  onDocumentSelect,
  dossierUrl,
  errors = {},
}) => {
  const [isOpened, setOpen] = useState(block.open);

  const mainBlock = block.documents ? block.documents[0] : null;
  const versionBlock = block.documents ? block.documents.slice(1) : [];

  return (
    <>
      {!!block?.documents?.length && (
        <>
          {/* {block.collapsed && (
            <div
              className="menuItem"
              onClick={() => setOpen(!isOpened)}
              style={{ cursor: 'pointer' }}>
              {isOpened && <i className="iconChevronUp icon" />}
              {!isOpened && <i className="iconChevronDown icon" />}
              <span style={{ marginLeft: '5px' }}>{block.name}</span>
            </div>
          )} */}

          {mainBlock && (
            <MenuTab
              uuid={uuid}
              validationErrorMessage={errors[mainBlock.type]}
              disabled={hiddenTabs.includes(mainBlock.type)}
              key={mainBlock.type}
              id={mainBlock.type}
              document={mainBlock}
              selected={mainBlock.type === selected}
              onDocumentSelect={onDocumentSelect}
              // hidden={!isOpened && block.collapsed}
              dossierUrl={dossierUrl}
              isOpened={isOpened}
              setOpen={setOpen}
              collapsed={block.collapsed}
            />
          )}

          {versionBlock.map((document) => (
            <MenuTab
              uuid={uuid}
              validationErrorMessage={errors[document.type]}
              disabled={hiddenTabs.includes(document.type)}
              key={document.type}
              id={document.type}
              document={document}
              selected={document.type === selected}
              onDocumentSelect={onDocumentSelect}
              hidden={!isOpened && block.collapsed}
              dossierUrl={dossierUrl}
            />
          ))}
        </>
      )}
    </>
  );
};

export default MenuBlock;
