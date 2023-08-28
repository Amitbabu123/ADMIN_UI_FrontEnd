import React, { Component } from "react";
import { Select, Input, message } from "antd";
import DataTable from "./DataTable";
import "../css/Home.css";
import "antd/dist/reset.css";

const { Option } = Select;
const { Search } = Input;

export default class home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSearchType: "",
      searchInputValue: "",
      totalDataRecieved: 0,
      fetchedData: [],
      loadingApi: false,
      displayedData: [],
    };
  }

  componentDidMount() {
    this.fetchApiData();
  }

  async fetchApiData() {
    try {
      this.setState({
        loadingApi: true,
      });

      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const data = await response.json();

      const formattedData = data.map(({ id, ...rest }) => ({
        key: id,
        ...rest,
      }));

      this.setState({
        fetchedData: formattedData,
        displayedData: formattedData,
        totalDataRecieved: data.length,
        loadingApi: false,
      });
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  }

  // Function to handle the change of search type
  handleSearchTypeChange = (selectedValue) => {
    this.setState({
      selectedSearchType: selectedValue,
    });
  };

  handleSearchInputChange = (inputValue) => {
    this.setState({
      searchInputValue: inputValue,
    });
  
    if (!this.state.selectedSearchType) {
      message.warning("Please select a search type before searching.");
      return; // Early return if no search type selected
    }
  
    const filteredData = this.state.fetchedData.filter((item) =>
      item[this.state.selectedSearchType].toLowerCase().includes(inputValue.toLowerCase())
    );
  
    this.setState({
      displayedData: filteredData,
    });
  };
  

  // Function to update data after deletion
  handleDelete = (deletedKeys) => {
    this.setState((prevState) => ({
      displayedData: prevState.displayedData.filter(
        (item) => !deletedKeys.includes(item.key)
      ),
    }));
  };

  // Function to update data after editing
  handleEdit = (key, editedName, editedEmail, editedRole) => {
    this.setState((prevState) => ({
      displayedData: prevState.displayedData.map((item) => {
        if (item.key === key) {
          return {
            ...item,
            name: editedName,
            email: editedEmail,
            role: editedRole,
          };
        }
        return item;
      }),
    }));
  };

  render() {
    return (
      <div className="admin-container">
        {/* Search header section with search type and input */}
        <div className="search-section">
          <Select
            className="search-select"
            placeholder="Search By"
            style={{ width: 300 }}
            onChange={this.handleSearchTypeChange}
          >
            <Option value="name">Name</Option>
            <Option value="email">Email</Option>
            <Option value="role">Role</Option>
          </Select>

          <Search
            className="search-input"
            placeholder="Enter search text"
            onSearch={this.handleSearchInputChange}
            style={{ width: 750 }}
            enterButton
          />
        </div>

        {/* Table section */}
        <DataTable
          data={this.state.displayedData} // Pass the displayed data to the DataTable component
          updateAfterDelete={this.handleDelete}
          updateAfterEdit={this.handleEdit}
        />

        {/* Footer */}
        <p className="app-footer">
  This Admin-UI project is part of the Frontend Challenge, developed by Amit Kumar &#169; 2023.
</p>

      </div>
    );
  }
}
