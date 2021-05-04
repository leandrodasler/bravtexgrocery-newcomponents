import "./AddressModal.css";
import React from "react";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "modalMain",
  "modalHeader",
  "modalForm",
  "modalLabel",
  "modalInput",
  "modalButton",
];

export default function AddressModal() {
  const [cep, setCep] = React.useState("");
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div>
      <section className={`${handles.modalMain}`}>
        <div className={`${handles.modalHeader}`}>
          <span>Insira seu CEP</span>
        </div>
        <form
          className={`${handles.modalForm}`}
          onSubmit={() => {
            if (cep.length === 8) {
              localStorage.setItem("CEP", cep);
            }
          }}
        >
          <label className={`${handles.modalLabel}`}>
            <input
              className={`${handles.modalInput}`}
              maxLength={8}
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
          <input
            className={`${handles.modalButton}`}
            type="submit"
            value="OK"
          />
        </form>
      </section>
    </div>
  );
}
