import "./modal.css";
import React from "react";

export default function Modal({ handleClose, show }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const [cep, setCep] = React.useState("");

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="modalHeader">
          <span>Insira seu CEP</span>
          <button type="button" onClick={handleClose}>
            X
          </button>
        </div>
        <form
          className="modalForm"
          onSubmit={() => {
            if (cep.length === 8) {
              localStorage.setItem("CEP", cep);
            }
          }}
        >
          <label className="modalLabel">
            <input
              className="modalInput"
              maxLength="8"
              onChange={(event) => {
                if (
                  event.target.value.length === 8 &&
                  !event.target.value.includes("-")
                ) {
                  setCep(event.target.value);
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
          <input className="modalButton" type="submit" value="OK" />
        </form>
      </section>
    </div>
  );
}
