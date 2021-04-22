import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useCssHandles } from "vtex.css-handles";
import "./AddToCartQuantityStepper.css";
import { AddressContainer } from "vtex.address-form";

const CSS_HANDLES = [
  "containerAddCartButton",
  "containerQuantity",
  "contentAddedToCartTxt",
  "contentQuantity",
];

const CurrentAddressComponent = () => {
  const handles = useCssHandles(CSS_HANDLES);

  const [localidade, setLocalidade] = React.useState("");
  const [cep, setCep] = React.useState("");

  React.useEffect(() => {
    cep.length === 8 &&
      fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
        mode: "cors",
        cache: "default",
      })
        .then((response) => response.json())
        .then((data) => {
          setLocalidade(data.localidade + " - " + data.uf);
        })
        .catch(setLocalidade(""));
  }, [cep]);

  return (
    <>
      <div className="addressComponent">
        <img className="pinIcon" src={pin} alt="Ícone de Localização" />
        <div className="addressComponentInfo">
          <span className="addressComponentTitle">Enviar para: </span>
          <span className="currentAddress">
            {localidade ? localidade : "Clique para inserir seu CEP"}
          </span>
        </div>
      </div>

      <div>
        <form>
          <label>
            Insira seu CEP
            <input
              hidden={false}
              maxLength="8"
              onChange={(event) => {
                if (
                  event.target.value.length === 8 &&
                  !event.target.value.includes("-")
                ) {
                  event.target.value = event.target.value.replace(
                    /^([\d]{5})-*([\d]{3})/,
                    "$1-$2"
                  );
                } else {
                  event.target.value = event.target.value.replace("-", "");
                }
              }}
            />{" "}
          </label>
          <input
            type="submit"
            onSubmit={(event) => {
              event.preventDefault();
              if (event.target.value.length === 8) {
                setCep(event.target.value);
              }
            }}
          />
        </form>
      </div>
    </>
  );
};

export default CurrentAddressComponent;
