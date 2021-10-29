import React from "react";
import "./SellerText.css";
import { useCssHandles } from "vtex.css-handles";
import { useProduct } from "vtex.product-context";

const CSS_HANDLES = ["sellerDiv", "sellerText"];

const SellerText = () => {
  const handles = useCssHandles(CSS_HANDLES);
  const productContextValue = useProduct();

  return (
    <div className={`${handles.sellerDiv}`}>
      {productContextValue ? (
        <p className={`${handles.sellerText}`}>
          Vendido e entregue por: {productContextValue?.selectedItem?.sellers.find((seller) => seller.sellerDefault)?.sellerName}
        </p>
      ) : (
        ""
      )}
    </div>
  );
};

export default SellerText;
