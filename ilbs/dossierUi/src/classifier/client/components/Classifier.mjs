/* eslint-disable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-disable no-shadow -- Включение правила no-shadow */
/* eslint-disable no-use-before-define -- Включение правила no-use-before-define*/

/* eslint-disable no-unused-expressions -- Включение правила no-unused-expressions */

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

import { useDocuments, useTasks } from "../hooks/index.js";
// import { compress } from "../utils/compressor.js";
// import { registerTwain } from "../utils/twain.js";
import Dimmable from "./elements/Dimmable.js";
import Loader from "./elements/Loader.js";
import ListGallery from "./gallery/ListGallery.js";
import SortableGallery from "./gallery/SortableGallery.js";
import ListMenu from "./menu/ListMenu.js";
import Menu from "./menu/Menu.js";
import UploadDropzone from "./UploadDropzone.js";

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
      defaultTab = "classifier",
      withViewTypes = false,
      defaultViewType = "grid",
      context = null,
      disabled = false,
    },
    ref,
  ) => {
    const [classifier, setClassifier] = useState(schema.classifier);
    // const { tasks } = useTasks(uuid, dossierUrl);
    const {
      tasksCount,
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
    // const [countStartedTasks, setCountStartedTasks] = useState(0);
    const [dragFrom, setDrugFrom] = useState();
    const [prev, setPrev] = useState(null);
    const [pageErrors, setPageErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState(defaultViewType);

    const [selectedIds, setSelectedIds] = useState([]);

    /**
     * Обрабатывает выбор элемента по его идентификатору.
     * @param {string} id Идентификатор элемента для выбора.
     * @returns {void}
     */
    const handleSelect = id => {
      setSelectedIds(selectedIds => {
        if (selectedIds.includes(id)) {
          return selectedIds.filter(value => value !== id);
        }

        if (!selectedIds.length || findContainer(id) !== findContainer(selectedIds[0])) {
          return [id];
        }

        return selectedIds.concat(id);
      });
    };

    /**
     * Фильтрует список элементов на основе активного элемента.
     * @param {Array} items Массив элементов для фильтрации.
     * @param {string} activeId Идентификатор активного элемента.
     * @returns {Array} - Отфильтрованный список элементов.
     */
    const filterItems = (items, activeId) => {
      // activeDraggable.id
      if (!activeId) {
        return items;
      }

      return items.filter(id => id === activeId || !selectedIds.includes(id));
    };

    const selectedDocument =
      (selectedTab?.type !== "classifier" && documents[selectedTab?.type]?.pages) || [];

    useEffect(() => {
      selectTab(getSelectedTab());
    }, [uuid]);

    useEffect(() => {
      if (documents[selectedTab?.type]?.pages?.length === 0) {
        setView("grid");
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

    // const finishedTasks = tasks.filter(({ status }) => status.code === "FINISHED");

    useImperativeHandle(ref, () => ({
      /**
       * Изменяет выбранную вкладку на основе переданного типа.
       * @param {string} type Тип вкладки, которую нужно выбрать.
       * @returns {void}
       */
      changeSelectedTab(type) {
        const tab = documentsTabs.find(tab => tab.type === type);

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

    /**
     * Возвращает выбранную вкладку в зависимости от конфигурации.
     * @returns {Object} - Объект, представляющий выбранную вкладку.
     */
    function getSelectedTab() {
      if (defaultTab === "classifier") {
        if (schema.classifier.disabled) {
          return documentsTabs[0];
        }

        return { type: "classifier" };
      }

      const tab = documentsTabs.find(tab => tab.type === defaultTab);

      return tab || { type: null };
    }

    // useEffect(() => {
    //   const processTasks = tasks.filter(
    //     ({ status }) => status.code === "STARTED" || status.code === "IN_QUEUE",
    //   );

    //   setCountStartedTasks(processTasks.length);
    // }, [tasks]);

    // useEffect(() => {
    //   const documents = revalidateDocuments();

    //   if (Object.entries(documents).length) {
    //     if (prev && onUpdate) {
    //       for (const type in documents) {
    //         if (prev[type].length !== documents[type].pages.length) {
    //           const tab = documentsTabs.find(tab => tab.type === type);

    //           !["unknown", "classifier"].includes(tab.type) && onUpdate(tab, documents);
    //         }
    //       }
    //     }

    //     setPrev(documents);
    //   }
    // }, [finishedTasks.length]);

    // useEffect(() => {
    //   const interval = setInterval(() => setTwainHandler() && clearInterval(interval), 1000);
    // }, []);

    // useEffect(() => {
    //   setTwainHandler();
    // }, [selectedTab]);

    // /**
    //  * Добавляет новый обработчик для загрузки документов через Twain.
    //  * @returns {void}
    //  */
    // const setTwainHandler = () =>
    //   registerTwain(file => file && handleDocumentsDrop([file]), selectedTab?.type);

    /* eslint-disable no-param-reassign -- Включение правила no-param-reassign */
    /**
     * Ищет контейнер для элемента по его идентификатору.
     * @param {string} id Идентификатор элемента для поиска.
     * @returns {string|null} - Найденный контейнер или `null`, если контейнер не найден.
     */
    const findContainer = id => {
      if (id in documents) {
        return id;
      }

      if (typeof id === "object") {
        id = id.path;
      }

      return Object.keys(documents).find(key =>
        documents[key]?.pages?.find(item => item.path === id));
    };
    /* eslint-enable no-param-reassign -- Включение правила no-param-reassign */

    /**
     * Отменяет перетаскивание и сбрасывает состояние перетаскиваемых элементов.
     * @returns {void}
     */
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

    /* eslint-disable consistent-return -- Включение правила consistent-return */
    /**
     * Обрабатывает загрузку документов.
     * @param {Array<File>} acceptedFiles Массив загруженных файлов.
     * @returns {Promise<void>} - Загружает документы и обновляет состояние.
     */
    const handleDocumentsDrop = async acceptedFiles => {
      if (!acceptedFiles.length) {
        return showError("Загрузите файл в формате PDF или JPG.");
      }

      if (!selectedTab) {
        return;
      }

      if (selectedTab.type === "classifier") {
        // !countStartedTasks && setCountStartedTasks(-1);
        const availableClasses = documentsTabs.filter(tab => !tab.readonly).map(tab => tab.type);
        const compressedFiles = acceptedFiles; // await compressFiles(acceptedFiles);

        classifyDocument(uuid, compressedFiles, availableClasses).then(revalidateDocuments);
      } else {
        setLoading(true);
        const compressedFiles = acceptedFiles; // await compressFiles(acceptedFiles);

        uploadPages(uuid, selectedTab.documentName, compressedFiles)
          .then(async result => {
            const documents = await revalidateDocuments();

            onUpdate && onUpdate(selectedTab, documents);
            setPrev(documents);
            result.error && processError(result.error, documents);
          })
          .finally(() => setLoading(false));
      }
    };
    /* eslint-enable consistent-return -- Включение правила consistent-return */

    // /**
    //  * Сжимает файлы изображений.
    //  * @param {Array<File>} files Массив файлов для сжатия.
    //  * @returns {Promise<Array<File>>} - Возвращает сжатые файлы.
    //  */
    // const compressFiles = async files =>
    //   Promise.all(
    //     files.map(async (file, index) => {
    //       if (file.type.includes("image/")) {
    //         return compress(file, 500, Infinity, 1000, 0.9).then(
    //           blob => new File([blob], file.name, { type: file.type }),
    //         );
    //       }
    //       return file;
    //     }),
    //   );
    /* eslint-disable no-restricted-syntax -- Включение правила no-restricted-syntax */
    /**
     * Обрабатывает ошибки при загрузке документов.
     * @param {Object} error Объект ошибки.
     * @param {Object} documents Текущие документы.
     * @returns {void}
     */
    const processError = (error, documents) => {
      console.log(error, documents);
      showError("При загрузке документа произошла ошибка");
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
    /* eslint-enable no-restricted-syntax -- Включение правила no-restricted-syntax */
    /**
     * Обрабатывает удаление страницы.
     * @param {string} pageSrc Источник страницы для удаления.
     * @returns {Promise<void>} - Выполняет удаление страницы.
     */
    const handlePageDelete = async pageSrc => {
      const activeContainer = findContainer(pageSrc);

      const newDocumentsList = {
        ...documents,
        [activeContainer]: {
          pages: documents[activeContainer]?.pages.filter(item => item !== pageSrc),
          errors: documents[activeContainer]?.errors | [],
          lastModified: documents[activeContainer]?.lastModified,
        },
      };

      mutateDocuments({ document: newDocumentsList, tasksCount }, false);

      await deletePage(pageSrc);

      onRemove && onRemove(selectedTab, newDocumentsList);

      revalidateDocuments();
    };

    /* eslint-disable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
    /**
     * Обрабатывает начало перетаскивания.
     * @param {Object} root0 Параметры перетаскивания.
     * @param {Object} root0.active Активный элемент.
     * @returns {void}
     */
    const onDragStart = ({ active }) => {
      setSelectedIds(selected => (selected.includes(active.id) ? selected : []));

      setDrugFrom(selectedTab);
      setActiveDraggable(active);
      const container = findContainer(active.id);

      setDraggableOrigin({
        container,
        type: selectedTab.documentName,
        index: active.data.current.sortable.index,
      });
    };

    /**
     * Обрабатывает завершение перетаскивания и обновляет список документов.
     * @param {Object} params Параметры, связанные с завершением перетаскивания.
     * @param {Object} params.active Активный элемент, который перетаскивается.
     * @param {Object} params.over Элемент, над которым завершено перетаскивание.
     * @returns {Promise<void>} - Обновляет документы после перетаскивания.
     */
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
          .map(item => item.path)
          .indexOf(active.id);

        let overIndex = documents[overContainer]?.pages.map(item => item.path).indexOf(overId);

        if (activeIndex === -1) {
          return;
        }

        if (overIndex === -1) {
          overIndex = 0;
        }

        if (activeIndex !== overIndex) {
          const data = {
            documents: {
              ...documents,
              [overContainer]: {
                ...documents[overContainer],
                pages: arrayMove(documents[overContainer]?.pages, activeIndex, overIndex),
              },
            },
            tasksCount,
          };

          mutateDocuments(data, false);
        }

        const overContainerTo = overContainer.split("_")[0];

        // MULTI-SELECT LOGIC:
        if (draggableOrigin.container !== overContainer) {
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
                const urlData = selected.split("?")[0].split("/");
                const pageNumber = urlData[urlData.length - 1];

                return {
                  // Перемещаем два и более выделенных документа
                  from: {
                    class: draggableOrigin.type,
                    page: Number(pageNumber),
                  },
                  to: { class: overContainerTo, page: overIndex + 1 + idx },
                };
              });

          await correctDocuments(newDocs);
        } else {
          const newDocsElse =
            selectedIds.length < 2
              ? [
                {
                  from: {
                    class: activeContainer.split("_")[0],
                    page: activeIndex + 1,
                  },
                  to: { class: overContainerTo, page: overIndex + 1 },
                },
              ]
              : selectedIds.map((selected, idx) => {
                const urlData = selected.split("?")[0].split("/");
                const pageNumber = urlData[urlData.length - 1];

                return {
                  from: {
                    class: activeContainer.split("_")[0],
                    page: Number(pageNumber),
                  },
                  to: { class: overContainerTo, page: overIndex + idx + 1 },
                };
              });

          await correctDocuments(newDocsElse);
        }

        await revalidateDocuments();
      }

      setActiveDraggable(null);
      setDraggableOrigin(null);
      setSelectedIds([]);

      onDrag &&
        onDrag(
          documentsTabs.find(tab => tab.type === dragFrom.type),
          selectedTab,
          documents,
        );
    };

    /* eslint-disable no-unsafe-optional-chaining -- Включение правила no-unsafe-optional-chaining */
    /**
     * Обрабатывает перетаскивание документа на другую вкладку.
     * @param {Object} root0 Параметры перетаскивания.
     * @param {Object} root0.active Активный элемент.
     * @param {Object} root0.over Элемент, над которым происходит перетаскивание.
     * @returns {void}
     */
    const onDragOver = ({ active, over }) => {
      const overId = over?.id;

      if (!overId || overId === "void" || active.id in documents) {
        return;
      }

      if (over && over.data.current.tab) {
        const tab = documentsTabs.find(tab => tab.type === overId);

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

        const overIndex = overItems.map(item => item.path).indexOf(overId);
        const activeIndex = activeItems.map(item => item.path).indexOf(active.id);

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
          ? [active.id, ...selectedIds.filter(id => id !== active.id)]
          : [active.id];

        const newDocuments = {
          ...documents,

          [activeContainer]: {
            errors: documents[activeContainer].errors,
            pages: documents[activeContainer]?.pages.filter(item => !ids.includes(item.path)),
          },

          [overContainer]: {
            errors: documents[overContainer].errors,
            pages: [
              ...documents[overContainer]?.pages.slice(0, newIndex),

              ...documents[activeContainer]?.pages.filter(item => ids.includes(item.path)),

              ...documents[overContainer]?.pages.slice(
                newIndex,
                documents[overContainer]?.pages.length,
              ),
            ],
          },
        };

        mutateDocuments({ documents: newDocuments, tasksCount }, false);
      }
    };
    /* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
    /* eslint-enable no-unsafe-optional-chaining -- Включение правила no-unsafe-optional-chaining */

    /**
     * Меняет текущую выбранную вкладку.
     * @param {Event} _ Событие, которое инициировало смену вкладки (не используется).
     * @param {Object} root0 Объект с информацией о новой вкладке.
     * @param {string} root0.name Имя вкладки, на которую нужно переключиться.
     * @returns {void} - Функция ничего не возвращает.
     */
    const changeTab = (_, { name }) => {
      setSelectedIds([]);

      let tab;

      if (name === "classifier") {
        if (selectedTab?.type === "classifier") {
          selectTab(null);
          return;
        }

        tab = { type: "classifier", name: "Автоматически" };
      } else {
        if (selectedTab?.type === name) {
          return;
        }
        tab = documentsTabs.find(tab => tab.type === name);
      }

      selectTab(tab);
    };

    return (
      <div className="dossier classifier">
        <div className="grid gridCentered">
          {view === "grid" && (
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
                      active={(!!tasksCount && selectedTab?.type === "classifier") || loading}
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
                      dossierUrl={dossierUrl}
                    />
                  </Dimmable>
                </div>
              </DndContext>
            </>
          )}

          {view === "list" && (
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
              <ListGallery srcSet={selectedDocument} dossierUrl={dossierUrl}/>
            </div>
          )}
        </div>
      </div>
    );
  },
);

Classifier.displayName = "Classifier";

export default Classifier;

/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable no-shadow -- Включение правила no-shadow */
/* eslint-enable no-use-before-define -- Включение правила no-use-before-define*/
/* eslint-enable no-unused-expressions -- Включение правила no-unused-expressions */
