import Classifier from '@ilbru/dossier-ui/src/classifier/client/components/Classifier.mjs';
// import { useRef, useState } from 'react';
import { useEffect, useState } from 'react';

export default function App() {
  const uuid = '800';
  const dossierUrl = process.env.BASE_URL;

  const [schema, setSchema] = useState({});
  const [isSchemaLoaded, setSchemaLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fetchSchema = async (params) => {
    const path = `${dossierUrl}/api/schema`;

    const res = await fetch(path, {
      method: 'POST',
      body: JSON.stringify(params),
    });

    const body = await res.json();
    if (res.ok) {
      setSchema(body);
      setSchemaLoaded(true);
    } else {
      setIsError(true);
      setErrorText('Error');
      console.log('error', body);
    }
  };

  useEffect(() => {
    fetchSchema({
      tabs: {
        client: ['*'],
        product: ['*'],
        bail: ['*'],
        dealShopDocuments: ['*'],
        dealBankDocuments: ['*'],
      },
      stateCode: 'CREATED',
      uuid,
    });
  }, []);

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
        {isSchemaLoaded && (
          <Classifier
            name="classifier"
            withViewTypes
            defaultViewType="grid"
            dossierUrl={dossierUrl}
            uuid={uuid}
            schema={schema.client}
            onChangeTab={() => {}}
            // onInit={documentStore.setDocuments}
            // onAfterChange={documentStore.updateDocuments}
            defaultTab="passport"
          />
        )}
      </div>
    </>
  );
}
