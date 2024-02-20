import Classifier from '@ilbru/dossier-ui/src/classifier/client/components/Classifier.mjs';
// import { useRef, useState } from 'react';
import { useEffect, useState } from 'react';
import loanbrokerTestSchema from '../test/loanbrokerTestSchema.json';
import loandealTestSchema from '../test/loandealTestSchema.json';

export default function App() {
  const uuid = '6f19eeac-53ba-4f4d-adab-2dbb89f008d8';
  const dossierUrl = process.env.BASE_URL;

  // console.log('loanbrokerTestSchema', loanbrokerTestSchema);
  // console.log('loandealTestSchema', loandealTestSchema);

  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [context, setContext] = useState(null);

  const setOne = () => {
    console.log('setOne');
    setContext({ vin: '123' });
  };
  const setTwo = () => {
    setContext({ vin: '124' });
    console.log('setTwo');
  };

  return (
    <>
      {isError && (
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}>
          <span style={{ textAlign: 'center', fontSize: '20', color: 'red' }}>{errorText}</span>
        </div>
      )}
      <div>
        <button onClick={setOne}>123</button>
        <button onClick={setTwo}>124</button>
      </div>
      <div
        style={{
          border: '1px solid #b0b0b0',
          borderRadius: 10,
          padding: 20,
          marginTop: 50,
          width: 1127,
          marginLeft: 'auto !important',
          marginRight: 'auto !important',
          display: 'block',
          maxWidth: '100% !important',
        }}
        className="ui container">
        {/*<button style={{ margin: 20 }} onClick={() => {*/}
        {/*  console.log(childRef);*/}
        {/*  return childRef.current.changeSelectedTab('passport');*/}
        {/*}}>*/}
        {/*  Select passport*/}
        {/*</button>*/}

        <Classifier
          name="classifier"
          withViewTypes
          defaultViewType="grid"
          dossierUrl={dossierUrl}
          uuid={uuid}
          schema={loanbrokerTestSchema}
          onChangeTab={() => {}}
          // onInit={documentStore.setDocuments}
          // onAfterChange={documentStore.updateDocuments}
          defaultTab="passport"
          selectionMode={true}
          context={context}
          disabled={false}
        />
      </div>
    </>
  );
}
