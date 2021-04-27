import React from "react";
import Modal from "./Modal";

const pin = require("./pin.svg") as string

const CurrentAddressComponent = () => {

  const [localidade, setLocalidade] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
	  const cep = localStorage.getItem("CEP");
	  
      fetch(`https://viacep.com.br/ws/${cep}/json/`, {
        method: "GET",
        mode: "cors",
        cache: "default",
      })
        .then((response) => response.json())
        .then((data) => {
          setLocalidade(data.localidade + " - " + data.uf);
        })
        .catch(() => setLocalidade(''));
  }, []);

  return (
    <>
      <Modal show={showModal} handleClose={() => setShowModal(false)} />
      <div className="addressComponent">
        <img className="pinIcon" src={pin} alt="Ícone de Localização" />
        <div className="addressComponentInfo">
          <span className="addressComponentTitle">Enviar para: </span>
          <span className="currentAddress" onClick={() => setShowModal(true)}>
            {localidade ? localidade : "Clique para inserir seu CEP"}
          </span>
        </div>
      </div>
    </>
  );
};

export default CurrentAddressComponent;
