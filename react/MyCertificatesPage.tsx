import React, { Fragment } from "react";
import { Route } from "vtex.my-account-commons/Router";
import MyCertificates from "./components/MyCertificates/MyCertificates";

const MyCertificatesPage = () => (
  <Fragment>
    <Route path="/certificates" exact component={MyCertificates} />
  </Fragment>
);

export default MyCertificatesPage;
