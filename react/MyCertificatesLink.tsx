import { injectIntl } from "react-intl";

const MyCertificatesLink = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage({ id: "myCertificates.link" }),
      path: "/certificates",
    },
  ]);
};

export default injectIntl(MyCertificatesLink);
