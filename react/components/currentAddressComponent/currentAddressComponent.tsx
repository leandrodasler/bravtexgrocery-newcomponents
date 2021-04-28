import React from "react";
import "./CurrentAddressComponent.css";
import { useCssHandles } from "vtex.css-handles";

const pin = require("./pin.svg") as string;

const CSS_HANDLES = [
  "addressComponent",
  "pinIcon",
  "addressComponentInfo",
  "addressComponentTitle",
  "currentAddress",
];

const CurrentAddressComponent = () => {
  const [localidade, setLocalidade] = React.useState("");
  const handles = useCssHandles(CSS_HANDLES);

  React.useEffect(() => {
    const cep = localStorage.getItem("CEP");

    fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: "GET",
      mode: "cors",
      cache: "default",
    })
      .then((response) => response.json())
      .then((data) => {
        data.erro
          ? setLocalidade("CEP inválido, clique para alterar.")
          : setLocalidade(data.localidade + " - " + data.uf);
      })
      .catch(() => setLocalidade(""));
  }, []);

  return (
    <>
      <div className={`${handles.addressComponent}`}>
        <img
          className={`${handles.pinIcon}`}
          src={pin}
          alt="Ícone de Localização"
        />
        <div className={`${handles.addressComponentInfo}`}>
          <span className={`${handles.addressComponentTitle}`}>
            Enviar para:{" "}
          </span>
          <span className={`${handles.currentAddress}`}>
            {localidade ? localidade : "Clique para inserir seu CEP"}
          </span>
        </div>
      </div>
    </>
  );
};

export default CurrentAddressComponent;
