import React from "react";
import "./SellerText.css";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "sellerDiv",
  "sellerText"
];

const SellerText = () => {
  const [seller, setSeller] = React.useState("");
  const handles = useCssHandles(CSS_HANDLES);

  React.useEffect(() => {
    fetch(`/api/catalog_system/pvt/seller/list`, {
      credentials: "same-origin",
    })
      .then((response) => response.json())
      .then((data) => {
        setSeller(data[0].Name);
      });
  }, []);

  return (
    <div className={`${handles.sellerDiv}`}>
		{seller ? <p className={`${handles.sellerText}`}>Vendido e entregue por: {seller}</p> : ''}
    </div>
  );
};

export default SellerText;
