import React, { FC, useEffect, useState } from "react";
import { Layout, PageHeader, PageBlock, Button, Table, IconSuccess, IconFailure, ModalDialog } from "vtex.styleguide";

const commonFetchProperties: RequestInit = {
  headers: { "Content-Type": "application/json" },
  credentials: "same-origin",
};

const DEFAULT_STATE_LABEL = "Carregando...";

const AdminCertificatesUsers: FC = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [emptyStateLabel, setEmptyStateLabel] = useState(DEFAULT_STATE_LABEL);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [loadingConfirmation, setLoadingConfirmation] = useState(false);
  const [userToApproval, setUserToApproval] = useState<any>(null);

  const listUsers = () => {
    setUsers([]);
    setEmptyStateLabel(DEFAULT_STATE_LABEL);

    fetch(
      "/api/dataentities/clients/search?_schema=registration" +
        "&_fields=id,firstName,lastName,email,cpf,rg,category," +
        "membershipClub,patent,company,companyAddress,address,approved" +
        "&_sort=email ASC",
      commonFetchProperties
    )
      .then((res) => res.json())
      .then((res) => {
        setUsers(res);
        if (!res.length) {
          setEmptyStateLabel("Nenhum cadastro");
        }
      });
  };

  const handleConfirmationApproval = () => {
    if (userToApproval) {
      setLoadingConfirmation(true);

      fetch(`/api/dataentities/clients/documents/${userToApproval.id}`, {
        ...commonFetchProperties,
        method: "PATCH",
        body: JSON.stringify({ approved: !userToApproval.approved }),
      })
        .then((res) => res.text())
        .then(() => {
          setIsModalOpen(false);
          setLoadingConfirmation(false);
          setUsers((users) => users.map((user) => ({ ...user, approved: user.id === userToApproval.id ? !user.approved : user.approved })));
        });
    }
  };

  const handleConfirmationDelete = () => {
    if (userToApproval) {
      setLoadingConfirmation(true);

      fetch(`/api/dataentities/clients/documents/${userToApproval.id}`, {
        ...commonFetchProperties,
        method: "DELETE",
      })
        .then((res) => res.text())
        .then(() => {
          fetch(`/api/dataentities/clients/search?_schema=certificate&_fields=id&certificateEmail=${userToApproval.email}`, commonFetchProperties)
            .then((res) => res.json())
            .then((res) => {
              res.forEach((certificate) => {
                fetch(`/api/dataentities/clients/documents/${certificate.id}`, {
                  ...commonFetchProperties,
                  method: "DELETE",
                });
              });
            });
          setIsModalDeleteOpen(false);
          setIsModalOpen(false);
          setLoadingConfirmation(false);
          setUsers((users) => users.filter((user) => user.id !== userToApproval.id));
        });
    }
  };

  const handleCancelationApproval = () => {
    setIsModalOpen(false);
  };

  const handleCancelationDelete = () => {
    setIsModalDeleteOpen(false);
  };

  const handleChangeApproval = (user: object) => {
    setUserToApproval(user);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsModalDeleteOpen(true);
  };

  useEffect(listUsers, []);

  const defaultTableSchema = {
    properties: {
      firstName: {
        title: "Nome",
        cellRenderer: ({ rowData }) => rowData.firstName + " " + rowData.lastName,
      },
      email: {
        title: "Email",
      },
      category: {
        title: "Categoria",
      },
      membershipClub: {
        title: "Clube de afiliação",
      },
      approved: {
        title: "Aprovado?",
        width: 100,
        cellRenderer: ({ rowData }) => (
          <span className={"ml6 " + (rowData.approved ? "green" : "red")}>{rowData.approved ? <IconSuccess /> : <IconFailure />}</span>
        ),
      },
      id: {
        title: " ",
        width: 150,
        cellRenderer: ({ rowData }) => (
          <Button variation="secondary" size="small" onClick={() => handleChangeApproval(rowData)}>
            Analisar
          </Button>
        ),
      },
    },
  };

  return (
    <Layout
      fullWidth
      pageHeader={
        <PageHeader title="Usuários" subtitle="Usuários que solicitaram autorização de compra a ser validada por certificado">
          <Button onClick={listUsers}>Atualizar</Button>
        </PageHeader>
      }
    >
      <PageBlock>
        <ModalDialog
          centered
          loading={loadingConfirmation}
          confirmation={{
            onClick: handleConfirmationApproval,
            label: userToApproval?.approved ? "Bloquear" : "Aprovar",
            isDangerous: userToApproval?.approved,
          }}
          cancelation={{
            onClick: handleCancelationApproval,
            label: "Cancelar",
          }}
          isOpen={isModalOpen}
          onClose={handleCancelationApproval}
        >
          <h3>Analisar cadastro</h3>
          <section className="mb4">
            <strong>Status: </strong>{" "}
            {userToApproval?.approved ? (
              <span className="green">
                <strong>Aprovado</strong>
              </span>
            ) : (
              <span className="red">
                <strong>Bloqueado</strong>
              </span>
            )}
          </section>
          <section className="mb4">
            <strong>Nome: </strong>
            {userToApproval?.firstName + " " + userToApproval?.lastName}
          </section>
          <section className="mb4">
            <strong>Email: </strong>
            {userToApproval?.email}
          </section>
          <section className="mb4">
            <strong>Categoria: </strong>
            {userToApproval?.category}
          </section>
          <section className="mb4">
            <strong>Clube de afiliação: </strong>
            {userToApproval?.membershipClub}
          </section>
          <section className="mb4">
            <strong>CPF: </strong>
            {userToApproval?.cpf}
          </section>
          <section className="mb4">
            <strong>RG: </strong>
            {userToApproval?.rg}
          </section>
          <section className="mb4">
            <strong>Patente: </strong>
            {userToApproval?.patent}
          </section>
          <section className="mb4">
            <strong>Nome da empresa/órgão: </strong>
            {userToApproval?.company}
          </section>
          <section className="mb4">
            <strong>Endereço da empresa/órgão: </strong>
            {userToApproval?.companyAddress?.streetAddress &&
              userToApproval?.companyAddress?.streetAddress +
                ", " +
                userToApproval?.companyAddress?.streetNumber +
                ", CEP " +
                userToApproval?.companyAddress?.cep +
                (userToApproval?.companyAddress?.complement ? ", " + userToApproval?.companyAddress?.complement : "")}
          </section>
          <section className="mb4">
            <strong>Endereço pessoal: </strong>
            {userToApproval?.address?.streetAddress}, {userToApproval?.address?.streetNumber}, CEP {userToApproval?.address?.cep}
            {userToApproval?.address?.complement ? ", " + userToApproval?.address?.complement : ""}
          </section>
          <section className="mb4">
            <Button size="small" variation="danger" onClick={handleDelete}>
              Excluir cadastro?
            </Button>
          </section>

          <ModalDialog
            centered
            loading={loadingConfirmation}
            confirmation={{
              onClick: handleConfirmationDelete,
              label: "Excluir cadastro",
              isDangerous: true,
            }}
            cancelation={{
              onClick: handleCancelationDelete,
              label: "Cancelar",
            }}
            isOpen={isModalDeleteOpen}
            onClose={handleCancelationDelete}
          >
            <h3>Confirma a exclusão do cadastro?</h3>
            <section>Esta ação também irá excluir os certificados associados a este cadastro, se existirem.</section>
          </ModalDialog>
        </ModalDialog>
        <Table fullWidth schema={defaultTableSchema} items={users} emptyStateLabel={emptyStateLabel} />
      </PageBlock>
    </Layout>
  );
};

export default AdminCertificatesUsers;
