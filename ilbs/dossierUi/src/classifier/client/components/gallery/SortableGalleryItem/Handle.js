/**
 * Компонент для обработки перетаскивания элементов галереи
 * @param {Object} props Свойства компонента, передаваемые в кнопку
 * @returns {JSX.Element} Кнопка с иконкой для перетаскивания
 */
export function Handle(props) {
  return (
    <button
      title="Просмотр"
      data-cypress="draggable-handle"
      {...props}
      style={{
        position: "absolute",
        top: "10px",
        right: "45px",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="-1 -1 16 16">
        <path d="M9.625.875a.437.437 0 1 1 0-.875h2.555A1.82 1.82 0 0 1 14 1.82v2.555a.437.437 0 1 1-.875 0V1.82a.944.944 0 0 0-.945-.945zm3.5 8.543a.437.437 0 1 1 .875 0v2.762c0 1.004-.816 1.82-1.82 1.82h-1.727a.437.437 0 1 1 0-.875h1.727a.944.944 0 0 0 .945-.945zm-8.543 3.707a.437.437 0 1 1 0 .875H1.82A1.82 1.82 0 0 1 0 12.18V9.625a.437.437 0 1 1 .875 0v2.555c0 .523.422.945.945.945zM.875 4.375a.437.437 0 1 1-.875 0V1.82C0 .812.813 0 1.82 0h2.555a.437.437 0 1 1 0 .875H1.82a.944.944 0 0 0-.945.945zM7 9.188c1.5 0 2.895-.778 4.215-2.407C9.895 5.152 8.5 4.375 7 4.375s-2.895.777-4.215 2.406C4.105 8.411 5.5 9.188 7 9.188zm0 .874c-1.785 0-3.418-.91-4.895-2.73a.87.87 0 0 1 0-1.102C3.582 4.41 5.215 3.5 7 3.5c1.785 0 3.418.91 4.895 2.73a.87.87 0 0 1 0 1.102c-1.477 1.82-3.11 2.73-4.895 2.73zm0 0" />
        <path d="M7 7.875c.605 0 1.094-.488 1.094-1.094 0-.605-.489-1.093-1.094-1.093-.605 0-1.094.488-1.094 1.093 0 .606.489 1.094 1.094 1.094zm0 .875a1.97 1.97 0 0 1-1.969-1.969A1.97 1.97 0 0 1 7 4.813 1.97 1.97 0 0 1 8.969 6.78 1.97 1.97 0 0 1 7 8.75zm0 0" />
      </svg>
    </button>
  );
}
