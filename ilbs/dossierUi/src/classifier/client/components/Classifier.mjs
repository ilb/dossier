import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import SortableGallery from './gallery/SortableGallery.js';
import UploadDropzone from './UploadDropzone.js';
import Menu from './menu/Menu.js';
import { useDocuments, useTasks } from '../hooks/index.js';
import { registerTwain } from '../utils/twain.js';
import { compress } from '../utils/compressor.js';
import Dimmable from './elements/Dimmable.js';
import Loader from './elements/Loader.js';
import ListGallery from './gallery/ListGallery.js';
import ListMenu from './menu/ListMenu.js';

const Classifier = forwardRef(
  (
    {
      form,
      uuid,
      onInit,
      onUpdate,
      onRemove,
      onChange,
      onAfterChange,
      onChangeTab,
      onDrag,
      name,
      showError,
      schema,
      dossierUrl,
      error,
      hiddenTabs = [],
      readonlyClassifier = null,
      defaultTab = 'classifier',
      withViewTypes = false,
      defaultViewType = 'grid',
      context = null,
      disabled = false,
    },
    ref,
  ) => {
    const [classifier, setClassifier] = useState(schema.classifier);
    const { tasks } = useTasks(uuid, dossierUrl);
    const {
      documents,
      mutateDocuments,
      correctDocuments,
      revalidateDocuments,
      classifyDocument,
      deletePage,
      uploadPages,
    } = useDocuments(uuid, dossierUrl, context);

    const [documentsTabs, setDocumentsTabs] = useState(schema.tabs);
    const [selectedTab, selectTab] = useState(null);
    const [clonedItems, setClonedItems] = useState(null);
    const [draggableOrigin, setDraggableOrigin] = useState(null);
    const [activeDraggable, setActiveDraggable] = useState(null);
    const [countStartedTasks, setCountStartedTasks] = useState(0);
    const [dragFrom, setDrugFrom] = useState();
    const [prev, setPrev] = useState(null);
    const [pageErrors, setPageErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(defaultViewType);

    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelect = (id) => {
      setSelectedIds((selectedIds) => {
        if (selectedIds.includes(id)) {
          return selectedIds.filter((value) => value !== id);
        }

        if (!selectedIds.length || findContainer(id) !== findContainer(selectedIds[0])) {
          return [id];
        }

        return selectedIds.concat(id);
      });
    };

    const filterItems = (items, activeId) => {
      // activeDraggable.id
      if (!activeId) {
        return items;
      }

      return items.filter((id) => id === activeId || !selectedIds.includes(id));
    };

    const selectedDocument =
      (selectedTab?.type !== 'classifier' && documents[selectedTab?.type]?.pages) || [];

    useEffect(() => {
      selectTab(getSelectedTab());
    }, [uuid]);

    useEffect(() => {
      if (documents[selectedTab?.type]?.pages?.length === 0) {
        setView('grid');
      }
    }, [selectedTab]);

    useEffect(() => {
      setClassifier(schema.classifier);
      setDocumentsTabs(schema.tabs);
    }, [schema]);

    useEffect(() => {
      onChangeTab && onChangeTab(selectedTab);
    }, [selectedTab?.type]);

    /**
     * Добавление документов в форму
     */
    useEffect(() => {
      const uniformDocuments = {};
      for (const type in documents) {
        // Убрал проверку длины массива
        if (documents[type]) {
          uniformDocuments[type] = documents[type]?.pages;
        }
      }
      if (Object.keys(documents).length) {
        onAfterChange && onAfterChange(uniformDocuments);
        onChange && onChange(uniformDocuments);
      }
    }, [documents, form]);

    useEffect(() => {
      if (!prev && Object.keys(documents).length) {
        onInit && onInit(documents);
        setPrev(documents);
      }
    }, [documents]);

    const finishedTasks = tasks.filter(({ status }) => status.code === 'FINISHED');

    useImperativeHandle(ref, () => ({
      changeSelectedTab(type) {
        const tab = documentsTabs.find((tab) => tab.type === type);
        if (tab) {
          selectTab(tab);
        }
      },
    }));

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        // CHECK
        // line 264 Presets/Sortable/MultipleContainers.tsx https://github.com/clauderic/dnd-kit/pull/588/files
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    if (readonlyClassifier !== null) {
      classifier.readonly = readonlyClassifier;
    }

    function getSelectedTab() {
      if (defaultTab === 'classifier') {
        if (schema.classifier.disabled) {
          return documentsTabs[0];
        }

        return { type: 'classifier' };
      }

      const tab = documentsTabs.find((tab) => tab.type === defaultTab);

      return tab || { type: null };
    }

    useEffect(() => {
      const processTasks = tasks.filter(
        ({ status }) => status.code === 'STARTED' || status.code === 'IN_QUEUE',
      );
      setCountStartedTasks(processTasks.length);
    }, [tasks]);

    useEffect(() => {
      const documents = revalidateDocuments();
      if (Object.entries(documents).length) {
        if (prev && onUpdate) {
          for (const type in documents) {
            if (prev[type].length !== documents[type].pages.length) {
              const tab = documentsTabs.find((tab) => tab.type === type);

              !['unknown', 'classifier'].includes(tab.type) && onUpdate(tab, documents);
            }
          }
        }

        setPrev(documents);
      }
    }, [finishedTasks.length]);

    useEffect(() => {
      const interval = setInterval(() => setTwainHandler() && clearInterval(interval), 1000);
    }, []);

    useEffect(() => {
      setTwainHandler();
    }, [selectedTab]);

    const setTwainHandler = () => {
      return registerTwain((file) => file && handleDocumentsDrop([file]), selectedTab?.type);
    };

    const findContainer = (id) => {
      if (id in documents) {
        return id;
      }

      if (typeof id === 'object') {
        id = id.path;
      }

      return Object.keys(documents).find((key) =>
        documents[key]?.pages?.find((item) => item.path === id),
      );
    };

    const onDragCancel = () => {
      if (clonedItems) {
        // Reset items to their original state in case items have been
        // dragged across containrs
        mutateDocuments(clonedItems, false);
      }

      setActiveDraggable(null);
      setClonedItems(null);
      setDraggableOrigin(null);

      setSelectedIds([]);
    };

    const handleDocumentsDrop = async (acceptedFiles) => {
      if (!acceptedFiles.length) {
        return showError('Загрузите файл в формате PDF или JPG.');
      }

      if (!selectedTab) return;

      if (selectedTab.type === 'classifier') {
        !countStartedTasks && setCountStartedTasks(-1);
        const availableClasses = documentsTabs
          .filter((tab) => !tab.readonly)
          .map((tab) => tab.type);
        const compressedFiles = acceptedFiles; //await compressFiles(acceptedFiles);
        classifyDocument(uuid, compressedFiles, availableClasses).then(revalidateDocuments);
      } else {
        setLoading(true);
        const compressedFiles = acceptedFiles; //await compressFiles(acceptedFiles);

        uploadPages(uuid, selectedTab.documentName, compressedFiles)
          .then(async (result) => {
            const documents = await revalidateDocuments();
            onUpdate && onUpdate(selectedTab, documents);
            setPrev(documents);
            result.error && processError(result.error, documents);
          })
          .finally(() => setLoading(false));
      }
    };

    const compressFiles = async (files) => {
      return Promise.all(
        files.map(async (file, index) => {
          if (file.type.includes('image/')) {
            return compress(file, 500, Infinity, 1000, 0.9).then((blob) => {
              return new File([blob], file.name, { type: file.type });
            });
          } else {
            return file;
          }
        }),
      );
    };

    const processError = (error, documents) => {
      console.log(error, documents);
      alert('При загрузке документа произошла ошибка');
      // if (error?.description?.type === 'signatureError') {
      //   addPagesErrors(error.description.info, documents);
      //   toast({
      //     type: 'info',
      //     title: error.description.info
      //   });
      // } else {
      //   toast({
      //     type: 'error',
      //     title: error.description
      //   });
      // }
    };

    // const addPagesErrors = (errors, documents) => {
    //   setPageErrors({
    //     ...pageErrors,
    //     ...errors.reduce((acc, { number, count, description }) => {
    //       acc[documents[selectedTab.type][number - 1].uuid] = { count, description };
    //
    //       return acc;
    //     }, [])
    //   });
    // };

    const handlePageDelete = async (pageSrc) => {
      const activeContainer = findContainer(pageSrc);

      const newDocumentsList = {
        ...documents,
        [activeContainer]: {
          pages: documents[activeContainer]?.pages.filter((item) => item !== pageSrc),
          errors: documents[activeContainer]?.errors | [],
          lastModified: documents[activeContainer]?.lastModified,
        },
      };

      mutateDocuments(newDocumentsList, false);

      await deletePage(pageSrc);

      onRemove && onRemove(selectedTab, newDocumentsList);

      revalidateDocuments();
    };

    const onDragStart = ({ active }) => {
      setSelectedIds((selected) => (selected.includes(active.id) ? selected : []));

      setDrugFrom(selectedTab);
      setActiveDraggable(active);
      const container = findContainer(active.id);

      // console.log('active.data.current.sortable.index: ', active.data.current.sortable.index);

      setDraggableOrigin({
        container: container,
        type: selectedTab.documentName,
        index: active.data.current.sortable.index,
      });
    };

    const onDragEnd = async ({ active, over }) => {
      const activeContainer = findContainer(active.id);

      if (!activeContainer) {
        setActiveDraggable(null);
        return;
      }

      const overId = over?.id;

      if (!overId) {
        setActiveDraggable(null);
        setSelectedIds([]);
        return;
      }

      const overContainer = findContainer(overId);

      if (overContainer) {
        const activeIndex = documents[activeContainer]?.pages
          .map((item) => item.path)
          .indexOf(active.id);

        let overIndex = documents[overContainer]?.pages.map((item) => item.path).indexOf(overId);

        // console.log('over', over);
        // console.log('overId', overId);
        // console.log('overContainer', overContainer);
        // console.log('documents[overContainer]', documents[overContainer]);
        // console.log('1overIndex', overIndex);

        if (activeIndex === -1) {
          return;
        }

        if (overIndex === -1) {
          overIndex = 1;
        }

        // console.log('2overIndex', overIndex);

        if (activeIndex !== overIndex) {
          // console.log('3overIndex', overIndex);

          mutateDocuments(
            {
              ...documents,
              [overContainer]: {
                ...documents[overContainer],
                pages: arrayMove(documents[overContainer]?.pages, activeIndex, overIndex),
              },
            },
            false,
          );
        }

        const overContainerTo = overContainer.split('_')[0];

        // MULTI-SELECT LOGIC:
        if (draggableOrigin.container !== overContainer) {
          // console.log('draggableOrigin: ', draggableOrigin);
          // console.log('selectedIds: ', selectedIds);
          // console.log('overIndex: ', overIndex);

          const newDocs =
            selectedIds.length < 2 // Перемещаем один документ с его выделением или без (т.е. без клика на документ)
              ? [
                  {
                    from: {
                      class: draggableOrigin.type,
                      page: draggableOrigin.index + 1,
                    },
                    to: { class: overContainerTo, page: overIndex + 1 },
                  },
                ]
              : selectedIds.map((selected, idx) => {
                  const urlData = selected.split('?')[0].split('/');
                  const pageNumber = urlData[urlData.length - 1];

                  console.log('pageNumber', pageNumber);
                  console.log('idx', idx);

                  return {
                    // Перемещаем два и более выделенных документа
                    from: {
                      class: draggableOrigin.type,
                      page: Number(pageNumber),
                    },
                    to: { class: overContainerTo, page: overIndex + idx },
                  };
                });

          // console.log('newDocs: ', newDocs);

          await correctDocuments(newDocs);
        } else {
          const newDocsElse =
            selectedIds.length < 2
              ? [
                  {
                    from: {
                      class: activeContainer.split('_')[0],
                      page: activeIndex + 1,
                    },
                    to: { class: overContainerTo, page: overIndex + 1 },
                  },
                ]
              : selectedIds.map((selected, idx) => ({
                  from: {
                    class: activeContainer.split('_')[0],
                    page: activeIndex + idx,
                  },
                  to: { class: overContainerTo, page: overIndex + idx },
                }));

          // console.log('newDocsElse: ', newDocsElse);

          await correctDocuments(newDocsElse);
        }

        await revalidateDocuments();
      }

      setActiveDraggable(null);
      setDraggableOrigin(null);
      setSelectedIds([]);

      onDrag &&
        onDrag(
          documentsTabs.find((tab) => tab.type === dragFrom.type),
          selectedTab,
          documents,
        );
    };

    const onDragOver = ({ active, over }) => {
      const overId = over?.id;
      if (!overId || overId === 'void' || active.id in documents) {
        return;
      }

      if (over && over.data.current.tab) {
        const tab = documentsTabs.find((tab) => tab.type === overId);
        selectTab(tab);
      }

      const overContainer = findContainer(overId);
      const activeContainer = findContainer(active.id);

      if (!overContainer || !activeContainer) {
        return;
      }

      if (activeContainer !== overContainer) {
        const activeItems = documents[activeContainer]?.pages;
        const overItems = filterItems(documents[overContainer]?.pages, activeDraggable.id);

        const overIndex = overItems.map((item) => item.path).indexOf(overId);
        const activeIndex = activeItems.map((item) => item.path).indexOf(active.id);

        let newIndex;

        if (overId in documents) {
          newIndex = overItems.length + 1;
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.offsetTop > over.rect.offsetTop + over.rect.height;

          const modifier = isBelowOverItem ? 1 : 0;

          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
        }

        // MULTI-SELECT LOGIC:
        const ids = selectedIds.length
          ? [active.id, ...selectedIds.filter((id) => id !== active.id)]
          : [active.id];

        // console.log('onDragOver ids: ', ids);
        // console.log('onDragOver newIndex: ', newIndex);

        const newDocuments = {
          ...documents,

          [activeContainer]: {
            errors: documents[activeContainer].errors,
            pages: documents[activeContainer]?.pages.filter((item) => !ids.includes(item.path)),
          },

          [overContainer]: {
            errors: documents[overContainer].errors,
            pages: [
              ...documents[overContainer]?.pages.slice(0, newIndex),

              ...documents[activeContainer]?.pages.filter((item) => ids.includes(item.path)),

              ...documents[overContainer]?.pages.slice(
                newIndex,
                documents[overContainer]?.pages.length,
              ),
            ],
          },
        };

        // console.log('onDragOver newDocuments: ', JSON.stringify(newDocuments, null, 2));

        mutateDocuments(newDocuments, false);
      }
    };

    const changeTab = (_, { name }) => {
      setSelectedIds([]);

      let tab;

      if (name === 'classifier') {
        if (selectedTab?.type === 'classifier') {
          selectTab(null);
          return;
        }

        tab = { type: 'classifier', name: 'Автоматически' };
      } else {
        if (selectedTab?.type === name) return;
        tab = documentsTabs.find((tab) => tab.type === name);
      }

      selectTab(tab);
    };

    // LOGS
    // console.log('selectedDocument (srcSet): ', selectedDocument);
    // console.log('activeDraggable (active): ', activeDraggable);
    // console.log('selectedIds: ', selectedIds);

    return (
      <div className="dossier classifier">
        <div className="grid gridCentered">
          {view === 'grid' && (
            <>
              <DndContext
                modifiers={[snapCenterToCursor]}
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                onDragCancel={onDragCancel}
                collisionDetection={closestCenter}>
                <div className="dossier__wrap dossier__wrap__menu dossier__wrap__menu__grid">
                  <Menu
                    withViewTypes={withViewTypes}
                    view={view}
                    onChangeView={setView}
                    uuid={uuid}
                    errors={error?.messages}
                    blocks={schema.blocks}
                    classifier={classifier}
                    name={name}
                    documents={schema.tabs}
                    hiddenTabs={hiddenTabs}
                    selected={selectedTab?.type}
                    onDocumentSelect={changeTab}
                    dossierUrl={dossierUrl}
                    context={context}
                  />
                </div>
                <div className="dossier__wrap_preview">
                  {!disabled && selectedTab && !selectedTab.readonly && (
                    <UploadDropzone
                      onDrop={handleDocumentsDrop}
                      accept={selectedTab.accept}
                      fileType={selectedTab.fileType}
                    />
                  )}

                  <Dimmable>
                    <Loader
                      active={
                        (!!countStartedTasks && selectedTab?.type === 'classifier') || loading
                      }
                      loaderText="Загрузка..."
                    />
                    <SortableGallery
                      pageErrors={pageErrors}
                      tab={selectedTab}
                      // MULTI-SELECT LOGIC:
                      srcSet={filterItems(selectedDocument, activeDraggable)}
                      onRemove={handlePageDelete}
                      active={activeDraggable}
                      disabled={disabled}
                      selectedIds={selectedIds}
                      handleSelect={handleSelect}
                      documents={documents}
                    />
                  </Dimmable>
                </div>
              </DndContext>
            </>
          )}

          {view === 'list' && (
            <div className="dossier__wrap dossier__wrap__menu dossier__wrap__menu__list">
              <ListMenu
                withViewTypes={withViewTypes}
                view={view}
                documents={schema.tabs}
                hiddenTabs={hiddenTabs}
                selected={selectedTab?.type}
                onDocumentSelect={changeTab}
                onChangeView={setView}
              />
              {selectedTab && !selectedTab.readonly && (
                <UploadDropzone
                  onDrop={handleDocumentsDrop}
                  accept={selectedTab.accept}
                  fileType={selectedTab.fileType}
                />
              )}
              <ListGallery srcSet={selectedDocument} />
            </div>
          )}
        </div>
      </div>
    );
  },
);

Classifier.displayName = 'Classifier';

export default Classifier;
