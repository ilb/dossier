import { Classifier } from '../src/client.js';
// import { useRef, useState } from 'react';
import schema from '../../dossierCore/src/schemas/mockSchema.js';
import ClassifierSchemaBuilder from '../src/classifier/schemeBuilder/services/ClassifierSchemaBuilder.js';

export default function App() {
  const uuid = '7533b049-88ca-489b-878a-3ac1c8616fe7';

  const builder = new ClassifierSchemaBuilder();

  const classifierSchema = builder.build(schema, {
    dossierCode: 'client',
    dossierMode: 'analyst',
    stateCode: 'CREATED',
  });

  return (
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
        dossierUrl={'http://127.0.0.1:3020/loandossier'}
        uuid={uuid}
        schema={classifierSchema}
        onChangeTab={(tab) => console.log('tab', tab)}
        // onInit={documentStore.setDocuments}
        // onAfterChange={documentStore.updateDocuments}
        defaultTab="passport"
      />
    </div>
  );
}
