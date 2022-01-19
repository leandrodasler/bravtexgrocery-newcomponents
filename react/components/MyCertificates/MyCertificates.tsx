import React, { useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import { Spinner, Table, Button, ButtonWithIcon, IconUpload, IconUnorderedList, ModalDialog, IconDelete } from "vtex.styleguide";
import { ContentWrapper } from "vtex.my-account-commons";

type Certificate = {
  id: string;
  certificateNumber: string;
  certificateEmail: string;
  certificateDateBegin: string;
  certificateDateEnd: string;
  certificateIssuerOrganization: string;
  certificateFile: string;
  createdIn: string;
};

const commonFetchProperties: RequestInit = {
  headers: { "Content-Type": "application/json" },
  credentials: "same-origin",
};

const MyCertificates = ({ intl }) => {
  const [userEmail, setUserEmail] = useState("");
  const [certificates, setCertificates] = useState<Array<Certificate> | null | undefined>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null);

  const listCertificates = () => {
    if (userEmail) {
      setCertificates(null);
      fetch(
        `/api/dataentities/clients/search?_schema=certificate&_fields=id,createdIn,certificateEmail,certificateNumber,certificateDateBegin,certificateDateEnd,certificateIssuerOrganization,certificateFile&certificateEmail=${userEmail}&_sort=createdIn ASC`,
        commonFetchProperties
      )
        .then((res) => res.json())
        .then((res) => {
          setCertificates(res);
        });
    }
  };

  const defaultTableSchema = {
    properties: {
      certificateNumber: {
        title: intl.formatMessage({ id: "myCertificates.number" }),
      },
      certificateDateBegin: {
        title: intl.formatMessage({ id: "myCertificates.shelfLife" }),
        cellRenderer: ({ rowData }) =>
          rowData.certificateDateBegin &&
          rowData.certificateDateEnd &&
          new Date(rowData.certificateDateBegin).toLocaleDateString() + " - " + new Date(rowData.certificateDateEnd).toLocaleDateString(),
      },
      certificateIssuerOrganization: {
        title: intl.formatMessage({ id: "myCertificates.issuerOrganization" }),
      },
      certificateFile: {
        title: intl.formatMessage({ id: "myCertificates.file" }),
        width: 150,
        cellRenderer: ({ rowData }) => (
          <Button variation="secondary" size="small" href={rowData.certificateFile} target="_blank">
            {intl.formatMessage({ id: "myCertificates.viewFile" })}
          </Button>
        ),
      },
      id: {
        title: " ",
        width: 60,
        cellRenderer: ({ rowData }) => <ButtonWithIcon variation="danger" size="small" onClick={() => handleDelete(rowData)} icon={<IconDelete />} />,
      },
    },
  };

  const handleConfirmation = () => {
    if (certificateToDelete) {
      setLoadingDelete(true);

      fetch(`/api/dataentities/clients/documents/${certificateToDelete.id}`, {
        ...commonFetchProperties,
        method: "DELETE",
      })
        .then((res) => res.text())
        .then(() => {
          setIsModalOpen(false);
          setLoadingDelete(false);
          setCertificates((certificates) => certificates?.filter((certificate) => certificate.id !== certificateToDelete.id));
        });
    }
  };

  const handleCancelation = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (certificate: Certificate) => {
    setCertificateToDelete(certificate);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetch("/api/vtexid/pub/authenticated/user", commonFetchProperties)
      .then((res) => res.json())
      .then((res) => {
        setUserEmail(res.user);
      });
  }, []);

  useEffect(listCertificates, [userEmail]);

  return (
    <ContentWrapper
      titleId="myCertificates.link"
      headerContent={
        <>
          <ButtonWithIcon className="mr4" variation="primary" size="small" icon={<IconUpload />} href="/certificado">
            {intl.formatMessage({ id: "myCertificates.add" })}
          </ButtonWithIcon>{" "}
          <ButtonWithIcon variation="primary" size="small" icon={<IconUnorderedList />} onClick={listCertificates}>
            {intl.formatMessage({ id: "myCertificates.reload" })}
          </ButtonWithIcon>
        </>
      }
      namespace="my-certificates"
    >
      {() => (
        <>
          {certificates?.length ? (
            <>
              <ModalDialog
                centered
                loading={loadingDelete}
                confirmation={{
                  onClick: () => handleConfirmation(),
                  label: intl.formatMessage({ id: "myCertificates.delete" }),
                  isDangerous: true,
                }}
                cancelation={{
                  onClick: handleCancelation,
                  label: intl.formatMessage({ id: "myCertificates.cancel" }),
                }}
                isOpen={isModalOpen}
                onClose={handleCancelation}
              >
                <h3>{intl.formatMessage({ id: "myCertificates.delete" })}?</h3>
                <section className="mb4">
                  <strong>{intl.formatMessage({ id: "myCertificates.number" })}: </strong>
                  {certificateToDelete?.certificateNumber}
                </section>
                <section className="mb4">
                  <strong>{intl.formatMessage({ id: "myCertificates.shelfLife" })}: </strong>
                  {certificateToDelete?.certificateDateBegin &&
                    certificateToDelete?.certificateDateEnd &&
                    new Date(certificateToDelete?.certificateDateBegin).toLocaleDateString() +
                      " - " +
                      new Date(certificateToDelete?.certificateDateEnd).toLocaleDateString()}
                </section>
                <section className="mb4">
                  <strong>{intl.formatMessage({ id: "myCertificates.issuerOrganization" })}: </strong>
                  {certificateToDelete?.certificateIssuerOrganization}
                </section>
                <section>
                  <strong>{intl.formatMessage({ id: "myCertificates.file" })}: </strong>
                  <Button variation="secondary" size="small" href={certificateToDelete?.certificateFile} target="_blank">
                    {intl.formatMessage({ id: "myCertificates.viewFile" })}
                  </Button>
                </section>
              </ModalDialog>
              <Table fullWidth schema={defaultTableSchema} items={certificates} />
            </>
          ) : certificates === null ? (
            <Spinner />
          ) : (
            intl.formatMessage({ id: "myCertificates.empty" })
          )}
        </>
      )}
    </ContentWrapper>
  );
};

export default injectIntl(MyCertificates);
