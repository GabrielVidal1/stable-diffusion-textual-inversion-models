import "./App.css";

import rawModels from "/models.json";
import axios from "axios";
import { useEffect, useState } from "react";

import HGLogo from "./components/hgLogo";

const filterModels = (model) => {
  return (
    !model.restricted &&
    model?.token?.startsWith("<") &&
    model.concept_images_urls.length > 0
  );
};

const modelsJSON = rawModels.filter(filterModels);

const downloadAs = (url, name) => {
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
      responseType: "blob",
    })
    .then((response) => {
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(response.data);
      a.href = url;
      a.download = name;
      a.click();
    })
    .catch((err) => {
      console.log("error", err);
    });
  // _paq.push(['trackLink', url, 'download']);
};

function ConceptTag({ concept }) {
  if (!concept) {
    return null;
  }
  const emoji = concept === "style" ? "🖼️" : "👤";

  return (
    <div
      className={`items-center flex gap-1 rounded-full px-3 py-1 bg-slate-200`}
    >
      <span className="text-sm font-extrabold text-gray-600">
        {emoji} {concept}
      </span>
    </div>
  );
}

function ModelCard({ model }) {
  const size = 100;

  return (
    <div className="relative shadow-lg p-2 flex flex-col items-center rounded bg-white gap-2">
      <div className="flex flex-row-reverse w-full">
        <a
          href={model.model_link}
          target="_blank"
          // className="absolute top-2 right-3"
        >
          <HGLogo />
        </a>

      <div className="flex-1">
        <h2 className="text-base font-bold">{model.token}</h2>

      </div>
      </div>

      <div className="bg-slate-200 rounded shadow-sm p-2">
        {model.concept_images_urls.length === 1 ? (
          <img
            className="object-cover"
            src={model.concept_images_urls[0]}
            style={{ width: size * 2 + 8, height: size * 2 + 8 }}
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {model.concept_images_urls.slice(0, 4).map((url, i) => (
              <div
                key={i}
                className="overflow-hidden"
                style={{ width: size, height: size }}
              >
                <img
                  className="object-cover"
                  src={url}
                  style={{ width: size, height: size }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-row w-full items-center">
        <ConceptTag concept={model.concept_type} />
        <span className="flex-1" />
        <button
          className="bg-blue-500 text-white shadow-sm py-1 px-2 border-0 border-b-4 border-blue-700"
          onClick={() =>
            downloadAs(model.model_download_link, model.model_name)
          }
        >
          Download
        </button>
      </div>
    </div>
  );
}

function App() {
  const [models, setModels] = useState(modelsJSON);
  const [type, setType] = useState();

  useEffect(() => {
    setModels(
      type
        ? modelsJSON.filter((model) => model.concept_type === type)
        : modelsJSON
    );
  }, [type]);

  return (
    <div className="App bg-slate-200">
      <select onChange={(e) => setType(e.target.value)} value={type}>
        <option value="">All</option>
        <option value="style">Styles</option>
        <option value="object">Objects</option>
      </select>

      <div className="flex flex-wrap gap-4 justify-center">
        {models.map((model, i) => (
          <ModelCard key={i} model={model} />
        ))}
      </div>
    </div>
  );
}

export default App;
