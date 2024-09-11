/**
 * Индикатор выбранного элемента
 * @param {Object} props Свойства компонента
 * @param {boolean} props.selected Указывает, выбран ли элемент
 * @returns {JSX.Element} Компонент индикатора выбора
 */
export function ItemSelectionIndicator(props) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        right: "11px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        width: "18px",
        height: "18px",
        borderRadius: "50%",
        backgroundColor: `${props.selected ? "#1677ff" : "transparent"}`,

        border: "3px solid transparent",
        borderColor: `${props.selected ? "transparent" : "#1677ff"}`,
        zIndex: 200,
      }}>
      {props.selected && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15px"
          height="15px"
          viewBox="-0.5 -0.5 15 15"
          fill="#fff"
          strokeWidth={2}>
          <g>
            <path
              d="M 10.5 39.76875 L 27.91875 57.20625 L 61.5 23.30625 L 53.49375 15.3 L 27.76875 41.00625 L 18.525 31.74375 Z M 10.5 39.76875 "
              transform="matrix(0.208333,0,0,0.208333,0,0)"
            />
          </g>
        </svg>
      )}
    </div>
  );
}
