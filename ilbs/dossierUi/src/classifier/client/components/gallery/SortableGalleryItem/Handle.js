export function Handle(props) {
  return (
    <button
      title='Переместить'
      data-cypress='draggable-handle'
      {...props}
      style={{
        position: 'absolute',
        top: '10px',
        right: '45px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
      }}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='14'
        height='14'
        viewBox='0 0 14 14'
      >
        <path d='M5.25 7.438v-.875H2.371l1-1.004-.617-.618L.69 7l2.063 2.059.617-.618-1-1.004zm5.996-2.497-.617.618 1 1.003H8.75v.875h2.879l-1 1.004.617.618L13.31 7zM7.437 11.63V8.75h-.875v2.879l-1.003-1-.618.617L7 13.31l2.059-2.063-.618-.617zm-.875-9.262V5.25h.875V2.371l1.004 1 .618-.617L7 .69 4.941 2.754l.618.617zm0 0' />
      </svg>
    </button>
  );
}
