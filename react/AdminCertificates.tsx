import React, { FC, useEffect, useState } from "react";
import { Layout, PageHeader, PageBlock, Button, Table } from "vtex.styleguide";

const commonFetchProperties: RequestInit = {
  headers: { "Content-Type": "application/json" },
  credentials: "same-origin",
};

const DEFAULT_STATE_LABEL = "Carregando...";

const AdminCertificates: FC = () => {
  const [certificates, setCertificates] = useState<Array<any>>([]);
  const [emptyStateLabel, setEmptyStateLabel] = useState(DEFAULT_STATE_LABEL);

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
          <Button variation="secondary" size="small" href={rowData.certificateFile} target="_blank">
            Visualizar
          </Button>
        ),
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
        <Table fullWidth schema={defaultTableSchema} items={certificates} emptyStateLabel={emptyStateLabel} />
      </PageBlock>
    </Layout>
  );
};

export default AdminCertificates;
