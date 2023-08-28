import React, { Component } from "react";
import { Table, Modal, Button, message } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import "../css/table.css";

// : Table component for displaying data and actions

export default class CustomTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedRows: [],
      selectedRecord: {},
      isEditModalVisible: false,
      editKey: "",
      editName: "",
      editEmail: "",
      editRole: "",
    };

    this.columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        editable: true,
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
        editable: true,
      },
      {
        title: "Action",
        key: "action",
        render: () => (
          <>
            <EditTwoTone onClick={this.handleEditClick} /> &nbsp; &nbsp; &nbsp;
            <DeleteTwoTone onClick={this.handleDeleteClick} />{" "}
          </>
        ),
      },
    ];
  }

  //  Handle click on Edit icon
  handleEditClick = () => {
    setTimeout(this.showEditModal, 100);
  };

  //Handle click on Delete icon or "Delete Selected" button
  handleDeleteClick = () => {
    setTimeout(this.showDeleteConfirm, 100);
  };

  // Show confirmation modal for delete action
  showDeleteConfirm = () => {
    this.props.updateAfterDelete(this.state.selectedRows);
    message.success(`${this.state.selectedRows.length} items deleted`);
  };

  // Prepare data for editing and show edit modal
  showEditModal = () => {
    this.setState({
      editKey: this.state.selectedRecord.key,
      editName: this.state.selectedRecord.name,
      editEmail: this.state.selectedRecord.email,
      editRole: this.state.selectedRecord.role,
    });

    setTimeout(this.showModal, 100);
  };

  // Show edit model screen
  showModal = () => {
    this.setState({
      isEditModalVisible: true,
    });
    console.clear();
  };

  //  Handle OK click in edit modal
  handleOk = () => {
    let nameValue = document.getElementById("nameEdit").innerText;
    let emailValue = document.getElementById("emailEdit").innerText;
    let roleValue = document.getElementById("roleEdit").innerText;
    this.setState({
      isEditModalVisible: false,
    });
    // Call parent component's function to update edited data
    this.props.updateAfterEdit(
      this.state.editKey,
      nameValue,
      emailValue,
      roleValue
    );
    message.success("Record is updateding");
  };

  //  Handle cancel click in edit modal
  handleCancel = () => {
    this.setState({
      isEditModalVisible: false,
    });
  };

  render() {
    return (
      <div className="custom-table">
        <Table
          rowKey="key"
          onRow={(record) => ({
            onClick: () => {
              this.setState((prevState) => ({
                selectedRows: prevState.selectedRows.includes(record.key)
                  ? prevState.selectedRows.filter((key) => key !== record.key)
                  : [...prevState.selectedRows, record.key],
                selectedRecord: prevState.selectedRows.includes(record.key)
                  ? {}
                  : record,
              }));
            },
          })}
          pagination={{ position: ["bottomCenter"] }}
          scroll={{ x: 700 }}
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: this.state.selectedRows,
            onChange: (selectedRowKeys) => {
              this.setState({
                selectedRows: selectedRowKeys,
              });
            },
          }}
          dataSource={this.props.data}
          columns={this.columns}
        />

        <Button
          className="delete-button"
          onClick={this.handleDeleteClick}
          type="primary"
          danger
        >
          Delete Selected
        </Button>

        <Modal
          title="Click to edit the required field"
          open={this.state.isEditModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <label>Name:</label>
          <p contentEditable="true" id="nameEdit">
            {this.state.editName}.
          </p>
          <label>Email:</label>
          <p contentEditable="true" id="emailEdit">
            {this.state.editEmail}
          </p>
          <label>Role:</label>
          <p contentEditable="true" id="roleEdit">
            {this.state.editRole}
          </p>
        </Modal>
      </div>
    );
  }
}
