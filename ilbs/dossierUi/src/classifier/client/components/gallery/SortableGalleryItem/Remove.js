export function Remove(props) {
  return (
    <button
      title='Удалить'
      {...props}
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '--fill': 'rgba(255, 70, 70, 0.95)',
        '--background': 'rgba(255, 70, 70, 0.1)',
        cursor: 'pointer',
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='14'
        height='14'
        viewBox='0 0 14 14'
      >
        <path d='M6.563 1.75a.876.876 0 0 0-.63.246.892.892 0 0 0-.245.629v.438H3.063v.874H3.5v7a1.32 1.32 0 0 0 1.313 1.313h5.25a1.32 1.32 0 0 0 1.312-1.313v-7h.438v-.874H9.187v-.438a.892.892 0 0 0-.246-.629.892.892 0 0 0-.629-.246zm0 .875h1.75v.438h-1.75zM4.374 3.938H10.5v7a.419.419 0 0 1-.129.308.419.419 0 0 1-.309.129h-5.25a.419.419 0 0 1-.308-.129.419.419 0 0 1-.129-.309zM5.25 5.25v4.813h.875V5.25zm1.75 0v4.813h.875V5.25zm1.75 0v4.813h.875V5.25zm0 0' />
      </svg>
    </button>
  );
}
