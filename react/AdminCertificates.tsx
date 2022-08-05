import React, { FC, useEffect, useState } from "react";
import { Layout, PageHeader, PageBlock, Button, Table, ButtonWithIcon, Modal, ModalDialog, IconDelete } from "vtex.styleguide";

const commonFetchProperties: RequestInit = {
  headers: { "Content-Type": "application/json" },
  credentials: "same-origin",
};

const DEFAULT_STATE_LABEL = "Carregando...";

const AdminCertificates: FC = () => {
  const [certificates, setCertificates] = useState<Array<any>>([]);
  const [emptyStateLabel, setEmptyStateLabel] = useState(DEFAULT_STATE_LABEL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [certificateToBeViewd, setCertificateToBeViewd] = useState<any>(null);
  const [certificateToDelete, setCertificateToDelete] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleOpenCertificate = (certificate: any) => {
    setCertificateToBeViewd(certificate);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          setIsModalDeleteOpen(false);
          setLoadingDelete(false);
          setCertificates((certificates) => certificates?.filter((certificate) => certificate.id !== certificateToDelete.id));
        });
    }
  };

  const handleCancelation = () => {
    setIsModalDeleteOpen(false);
  };

  const handleDelete = (certificate: any) => {
    setCertificateToDelete(certificate);
    setIsModalDeleteOpen(true);
  };

  const listCertificates = () => {
    setCertificates([]);
    setEmptyStateLabel(DEFAULT_STATE_LABEL);

    fetch(
      "/api/dataentities/clients/search?_schema=certificate" +
        "&_fields=id,createdIn,certificateEmail,certificateNumber," +
        "certificateDateBegin,certificateDateEnd,certificateIssuerOrganization,certificateFile" +
        "&_sort=certificateEmail ASC&_sort=createdIn ASC",
      commonFetchProperties
    )
      .then((res) => res.json())
      .then((res) => {
        setCertificates(res);
        if (!res.length) {
          setEmptyStateLabel("Nenhum certificado");
        }
      });
  };

  useEffect(listCertificates, []);

  const defaultTableSchema = {
    properties: {
      createdIn: {
        title: "Enviado em",
        width: 180,
        cellRenderer: ({ rowData }) =>
          rowData.createdIn && new Date(rowData.createdIn).toLocaleDateString() + " - " + new Date(rowData.createdIn).toLocaleTimeString(),
      },
      certificateEmail: {
        title: "Email",
      },
      certificateNumber: {
        title: "Número",
        width: 100,
      },
      certificateDateBegin: {
        title: "Validade",
        width: 210,
        cellRenderer: ({ rowData }) =>
          rowData.certificateDateBegin &&
          rowData.certificateDateEnd &&
          new Date(rowData.certificateDateBegin).toLocaleDateString() + " - " + new Date(rowData.certificateDateEnd).toLocaleDateString(),
      },
      certificateIssuerOrganization: {
        title: "Órgão emissor",
      },
      certificateFile: {
        title: "Arquivo",
        width: 140,
        cellRenderer: ({ rowData }) => (
          <Button variation="secondary" size="small" onClick={() => handleOpenCertificate(rowData)}>
            Visualizar
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

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title="Certificados" subtitle="Certificados enviados pelos usuários">
          <Button onClick={listCertificates}>Atualizar</Button>
        </PageHeader>
      }
    >
      <PageBlock>
        <Modal
          title={`Certificado nº ${certificateToBeViewd?.certificateNumber} - ${certificateToBeViewd?.certificateEmail}`}
          centered
          responsiveFullScreen
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <iframe src={certificateToBeViewd?.certificateFile} style={{ width: "100%", height: "80vh" }} />
        </Modal>
        <ModalDialog
          centered
          loading={loadingDelete}
          confirmation={{
            onClick: handleConfirmation,
            label: "Excluir certificado",
            isDangerous: true,
          }}
          cancelation={{
            onClick: handleCancelation,
            label: "Cancelar",
          }}
          isOpen={isModalDeleteOpen}
          onClose={handleCancelation}
        >
          <h3>Excluir certificado?</h3>
          <section className="mb4">
            <strong>Email: </strong>
            {certificateToDelete?.certificateEmail}
          </section>
          <section className="mb4">
            <strong>Número: </strong>
            {certificateToDelete?.certificateNumber}
          </section>
          <section className="mb4">
            <strong>Validade: </strong>
            {certificateToDelete?.certificateDateBegin &&
              certificateToDelete?.certificateDateEnd &&
              new Date(certificateToDelete?.certificateDateBegin).toLocaleDateString() +
                " - " +
                new Date(certificateToDelete?.certificateDateEnd).toLocaleDateString()}
          </section>
          <section className="mb4">
            <strong>Órgão emissor: </strong>
            {certificateToDelete?.certificateIssuerOrganization}
          </section>
          <section>
            <strong>Arquivo: </strong>
            <Button variation="secondary" size="small" onClick={() => handleOpenCertificate(certificateToDelete)}>
              Visualizar
            </Button>
          </section>
        </ModalDialog>
        <Table fullWidth schema={defaultTableSchema} items={certificates} emptyStateLabel={emptyStateLabel} />
      </PageBlock>
    </Layout>
  );
};

export default AdminCertificates;
