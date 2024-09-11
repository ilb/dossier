/**
 * Иконка предупреждения
 * @returns {JSX.Element} - SVG иконка.
 */
export const Alert = () => (
  <svg
    width='20px'
    height='20px'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    fill='red'
  >
    <line
      fill='none'
      stroke='red'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='8'
      y2='12'
    />

    <line
      fill='none'
      stroke='red'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      x1='12'
      x2='12'
      y1='16'
      y2='16'
    />

    <circle
      cx='12'
      cy='12'
      data-name='--Circle'
      fill='none'
      id='_--Circle'
      r='10'
      stroke='red'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </svg>
);

/**
 * Иконка успешной проверки
 * @returns {JSX.Element} - SVG иконка.
 */
export const CheckSuccess = () => (
  <svg
    width='20px'
    height='20px'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
      stroke='green'
      strokeWidth='2'
    />
    <path
      d='M9 12L10.6828 13.6828V13.6828C10.858 13.858 11.142 13.858 11.3172 13.6828V13.6828L15 10'
      stroke='green'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

/**
 * Иконка вопроса
 * @returns {JSX.Element} - SVG иконка.
 */
export const Question = () => (
  <svg
    width='20px'
    height='20px'
    viewBox='0 0 26 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M9 9.00001C9.00011 8.45004 9.15139 7.91068 9.43732 7.44088C9.72325 6.97108 10.1328 6.58891 10.6213 6.33616C11.1097 6.08341 11.6583 5.96979 12.2069 6.00773C12.7556 6.04566 13.2833 6.23369 13.7323 6.55126C14.1813 6.86883 14.5344 7.30372 14.7529 7.8084C14.9715 8.31308 15.0471 8.86813 14.9715 9.41288C14.8959 9.95763 14.6721 10.4711 14.3244 10.8972C13.9767 11.3234 13.5185 11.6457 13 11.829C12.7074 11.9325 12.4541 12.1241 12.275 12.3775C12.0959 12.6309 11.9998 12.9337 12 13.244V14.5'
      stroke='#71717A'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 18V18.5001'
      stroke='#71717A'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 23.25C18.2132 23.25 23.25 18.2132 23.25 12C23.25 5.7868 18.2132 0.75 12 0.75C5.7868 0.75 0.75 5.7868 0.75 12C0.75 18.2132 5.7868 23.25 12 23.25Z'
      stroke='#71717A'
      strokeWidth='1.5'
      strokeMiterlimit='10'
    />
  </svg>
);

/**
 * Иконка песочных часов
 * @returns {JSX.Element} - SVG иконка.
 */
export const Hourglass = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 16 16'
    fill='#FFCC00'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z' />
  </svg>
);
