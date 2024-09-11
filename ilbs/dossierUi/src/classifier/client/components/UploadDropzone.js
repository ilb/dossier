import { useDropzone } from "react-dropzone";

/**
 * Компонент загрузки файлов через дропзону
 * @param {Object} root0 Свойства компонента
 * @param {Function} root0.onDrop Функция, вызываемая при загрузке файлов
 * @param {string} root0.fileType Тип файла
 * @param {string[]} [root0.accept] Допустимые MIME-типы для загрузки
 * @returns {JSX.Element} Компонент дропзоны
 */
const UploadDropzone = ({
  onDrop,
  fileType,
  accept = [
    "image/jpg",
    "image/bmp",
    "image/jpeg",
    "image/tiff",
    "image/heic",
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/docx",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.text", // .odt
    "application/vnd.oasis.opendocument.spreadsheet", // .ods
    "application/vnd.oasis.opendocument.presentation", // .odp
    "application/vnd.oasis.opendocument.graphics", // .odg
    "application/vnd.oasis.opendocument.formula", // .odf
  ],
}) => {
  const dropzone = useDropzone({
    accept,
    /**
     * Обработка загруженных файлов
     * @param {File[]} acceptedFiles Массив загруженных файлов
     * @returns {Promise<void>} Промис, который разрешается после обработки файлов
     */
    onDrop: async acceptedFiles => onDrop(acceptedFiles),
  });

  return (
    <div className="segment dropzone_wrapper">
      <div className="dossier__uploads" style={{ cursor: "pointer" }}>
        <div
          style={{ padding: 10 }}
          {...dropzone.getRootProps({
            className: "updateDropzone",
          })}>
          <div>
            <span>
              {fileType?.includes("image/") || !fileType ? "Загрузить файлы" : "Заменить файл"}
            </span>
          </div>
          <div>Нажмите или перетащите</div>
          <input id={"dropzone_input"} {...dropzone.getInputProps()} />
        </div>
      </div>
    </div>
  );
};

export default UploadDropzone;
