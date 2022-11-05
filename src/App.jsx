import "./App.css";

import rawModels from "/models.json";
import axios from "axios";
import { useEffect, useState } from "react";

import openInNewTab from "./assets/openInNewTab.png";

const filterModels = (model) => {
  return (
    !model.restricted &&
    model?.token?.startsWith("<") &&
    model.concept_images_urls.length > 0
  );
};

const modelsJSON = rawModels.filter(filterModels);

const totalElements = modelsJSON.length;

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
      className={`items-center flex gap-1 rounded-full px-3 py-1 bg-slate-200 ml-2`}
    >
      <span className="text-sm font-extrabold text-gray-600">
        {emoji} {concept}
      </span>
    </div>
  );
}

function Image({ url, size }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => setLoading(true), [url]);

  return (
    <div
      className="overflow-hidden border-2 rounded-md border-slate-300 bg-slate-300"
      style={{ width: size, height: size, borderWidth: "1px" }}
    >
      <div
        className={`w-full h-full animate-pulse bg-slate-300 ${
          loading ? "" : "hidden"
        }`}
      ></div>
      <img
        className={`bg-slate-300 object-cover`}
        src={url}
        onLoad={() => setLoading(false)}
        style={{ width: size, height: size }}
      />
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
          {/* <HGLogo /> */}
          <img
            src={openInNewTab}
            width={20}
            height={20}
            className="invert contrast-50"
          />
        </a>

        <div className="flex-1">
          <h2 className="text-base font-bold w-52 text-ellipsis">
            {model.token}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded  p-2">
        {model.concept_images_urls.length === 1 ? (
          <img
            className="object-cover"
            src={model.concept_images_urls[0]}
            style={{ width: size * 2 + 8, height: size * 2 + 8 }}
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            {model.concept_images_urls.slice(0, 4).map((url, i) => (
              <Image key={i} url={url} size={size} />
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

const kkk = 3;

function Pagination({ page, setPage, resultsPerPage, total }) {
  const pageTotal = Math.ceil(total / resultsPerPage);

  let res = [];

  for (let i = 0; i < pageTotal; i++) {
    const number = i + 1;

    const cond =
      number < kkk || Math.abs(number - page) < kkk || pageTotal - number < kkk;

    res.push(
      <span key={number} className="flex ">
        {cond ? (
          <button
            className={`rounded-full transition-all p-0 w-6 sm:w-8 sm:h-8 ${
              number !== page
                ? "bg-white shadow-sm"
                : "bg-slate-500 text-white shadow-inner"
            } ${cond ? "" : "hidden"}`}
            onClick={() => setPage(number)}
          >
            {number}
          </button>
        ) : (
          <span className={`hidden sm:block w-2 text-2xl`}>·</span>
        )}
      </span>
    );
  }

  return <div className="flex gap-1 flex-wrap justify-center p-8">{res}</div>;
}

function App() {
  const [models, setModels] = useState(modelsJSON);
  const [type, setType] = useState();
  const [page, setPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(30);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    let e = type
      ? modelsJSON.filter((model) => model.concept_type === type)
      : modelsJSON;

    setTotal(e.length);

    setModels(
      e.slice(
        (page - 1) * resultsPerPage,
        (page - 1) * resultsPerPage + resultsPerPage
      )
    );
  }, [type, page]);

  useEffect(() => setPage(1), [type]);

  return (
    <div className="App bg-slate-200 sm:px-4">
      <h1 className="py-6 pt-12 text-3xl sm:text-5xl">
        Stable Diffusion Textual Inversion Embeddings
      </h1>
      <div className="text-justify sm:text-left p-6 flex flex-col gap-3">
        <p>
          Browser for the{" "}
          <a target="_blank" href="https://huggingface.co/sd-concepts-library">
            HuggingFace textual inversion library
          </a>
          . There are currently {totalElements} textual inversion embeddings on
          this site (much more in sd-concepts-library!). These are meant to be
          used with{" "}
          <a target="_blank" href="https://github.com/AUTOMATIC1111/stable-diffusion-webui">
            AUTOMATIC1111's SD WebUI
          </a>
          .
        </p>
        <p>
          Embeddings are downloaded straight from the HuggingFace repositories.
          The images displayed are the inputs, not the outputs. Want to quickly
          test concepts? Try the{" "}
          <a target="_blank" href="https://huggingface.co/spaces/sd-concepts-library/stable-diffusion-conceptualizer">
            Stable Diffusion Conceptualizer on HuggingFace
          </a>
          .{" "}
          <a target="_blank" href="https://huggingface.co/docs/diffusers/main/en/training/text_inversion">
            More info on textual inversion.
          </a>
        </p>
      </div>

      <div className="flex justify-center gap-4 py-6">
        <h3>Filter by concept type</h3>
        <select onChange={(e) => setType(e.target.value)} value={type}>
          <option value="">All</option>
          <option value="style">Styles</option>
          <option value="object">Objects</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {models.map((model, i) => (
          <ModelCard key={i} model={model} />
        ))}
      </div>
      <Pagination
        page={page}
        setPage={setPage}
        resultsPerPage={resultsPerPage}
        total={total}
      />
      <div className="h-20"></div>
    </div>
  );
}

export default App;
