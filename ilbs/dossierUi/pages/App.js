/* eslint-disable no-unused-vars -- Включение правила no-unused-vars */
import { useEffect, useState } from "react";

import { Classifier } from "../src/client.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/**
 * Основной компонент приложения.
 * @returns {JSX.Element} JSX разметка приложения.
 */
export default function App() {
  const uuid = "7533b049-88ca-489b-878a-3ac1c8616fe7";
  const dossierUrl = "http://localhost:3001/loandossier";

  const [schema, setSchema] = useState({});
  const [isSchemaLoaded, setSchemaLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState("");

  /**
   * Получает схему из API.
   * @param {Object} params Параметры запроса.
   * @param {string} params.dossierCode Код досье.
   * @param {string} params.stateCode Статус досье.
   * @returns {Promise<void>} Ничего не возвращает, обновляет состояние схемы.
   */
  const fetchSchema = async params => {
    const query = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
      .join("&");

    const path = `${dossierUrl}/api/schema?${query}`;

    const res = await fetch(path);
    const body = await res.json();

    if (res.ok) {
      setSchema(body);
      setSchemaLoaded(true);
    } else {
      setIsError(true);
      setErrorText("Error");
      console.error("error", body);
    }
  };

  useEffect(() => {
    fetchSchema({
      dossierCode: "client",
      stateCode: "CREATED",
    });
  }, []);

  /* eslint-disable no-restricted-syntax -- Включение правила no-restricted-syntax */
  return (
    <>
      {isError && (
        <div
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}>
          <span style={{ textAlign: "center", fontSize: "20", color: "red" }}>{errorText}</span>
        </div>
      )}
      <div
        style={{
          border: "1px solid #b0b0b0",
          borderRadius: 10,
          padding: 20,
          marginTop: 50,
          width: 1127,
          marginLeft: "auto !important",
          marginRight: "auto !important",
          display: "block",
          maxWidth: "100% !important",
        }}
        className="ui container">
        {/* <button style={{ margin: 20 }} onClick={() => {*/}
        {/*  console.log(childRef);*/}
        {/*  return childRef.current.changeSelectedTab('passport');*/}
        {/* }}>*/}
        {/*  Select passport*/}
        {/* </button>*/}
        {isSchemaLoaded && (
          <Classifier
            name="classifier"
            withViewTypes
            defaultViewType="grid"
            dossierUrl={dossierUrl}
            uuid={uuid}
            schema={schema}
            onChangeTab={tab => console.log("tab", tab)}
            // onInit={documentStore.setDocuments}
            // onAfterChange={documentStore.updateDocuments}
            defaultTab="passport"
          />
        )}
      </div>
    </>
  );
}
/* eslint-enable no-restricted-syntax -- Включение правила no-restricted-syntax */
