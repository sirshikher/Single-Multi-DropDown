/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import PropTypes from "prop-types";
import DropdownMultiple from "../DropdownMultiple";
import "../styles/global.sass";

/**
 * @function Dropdown - Get the multiSelect,title,listOfData,searchable props for the Dropdown.
 * @param {Object} Props - listData {Array of string or Array of json object} - eg. [{
 *                           title: "Blue",
                             path: "blue",   }]
                             or 
                             ['Blue','Red]
                             title="Colors"
                             multiSelect={true}
                             searchable={true}
                        },
 */

class Dropdown extends Component {
  constructor(props) {
    super(props);
    const { title, listData } = this.props;

    this.state = {
      isListOpen: false,
      title,
      selectedItem: null,
      keyword: "",
      listData,
    };
    this.searchField = React.createRef();
  }

  componentDidMount() {
    const { select } = this.props;

    if (select) {
      this.selectSingleItem(select);
    }
  }

  componentDidUpdate() {
    const { isListOpen } = this.state;

    setTimeout(() => {
      if (isListOpen) {
        window.addEventListener("click", this.close);
      } else {
        window.removeEventListener("click", this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.close);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { listData } = nextProps;

    if (JSON.stringify(listData) !== JSON.stringify(prevState.listData)) {
      return { listData };
    }

    return null;
  }

  close = () => {
    this.setState({
      isListOpen: false,
    });
  };

  clearSelection = () => {
    const { name, title, onChange } = this.props;

    this.setState(
      {
        selectedItem: null,
        title,
      },
      () => {
        onChange(null, name);
      }
    );
  };

  selectSingleItem = (item) => {
    const { listData } = this.props;

    const selectedItem = listData.find((i) => i === item);
    this.selectItem(selectedItem);
  };

  selectItem = (item) => {
    const { listData, selectedItem } = this.state;
    const { name, onChange } = this.props;

    let foundItem;

    if (!item) {
      foundItem = listData.find((i) => i === item || item);
    }

    this.setState(
      {
        title: item || foundItem,
        isListOpen: false,
        selectedItem: item,
      },
      () => selectedItem !== item && onChange(item, name)
    );
  };

  toggleList = () => {
    this.setState(
      (prevState) => ({
        isListOpen: !prevState.isListOpen,
        keyword: "",
      }),
      () => {
        if (this.state.isListOpen && this.searchField.current) {
          this.searchField.current.focus();
          this.setState({
            keyword: "",
          });
        }
      }
    );
  };
  onChange = (item, name) => {
    console.log(item, name);
  };

  filterList = (e) => {
    this.setState({
      keyword: e.target.value.toLowerCase(),
    });
  };

  listItems = () => {
    const { id, styles } = this.props;
    const { listItem, listItemNoResult } = styles;
    const { keyword, listData } = this.state;
    let tempList = [...listData];

    if (keyword.length) {
      tempList = listData.filter((item) =>
        item.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (tempList.length) {
      return tempList.map((item) => (
        <button
          type="button"
          className={`dd-list-item ${id}`}
          style={listItem}
          key={item}
          onClick={() => this.selectItem(item)}
        >
          {item}{" "}
        </button>
      ));
    }

    return (
      <div className={`dd-list-item no-result ${id}`} style={listItemNoResult}>
        "Search"
      </div>
    );
  };

  render() {
    const { id, searchable, styles, multiSelect, listData } = this.props;
    // We should not use alert but as we have don't have any error message component. So, I am using it
    if (typeof listData[0] !== "string" && !multiSelect) {
      alert("Wrong Data: Provide Array of string for singleSelect Dropdown");
    }

    const { isListOpen, title } = this.state;

    const { wrapper, header, headerTitle, list, listSearchBar, scrollList } =
      styles;

    return (
      <>
        {multiSelect ? (
          <DropdownMultiple
            name="colors"
            searchable={searchable}
            titleSingular="Colours"
            title="Colours"
            list={listData}
            onChange={this.onChange}
          />
        ) : (
          <div className={`dd-wrapper ${id}`} style={wrapper}>
            <button
              type="button"
              className={`dd-header ${id}`}
              style={header}
              onClick={this.toggleList}
            >
              <div className={`dd-header-title ${id}`} style={headerTitle}>
                {title}
              </div>
              {!isListOpen && <span className="headerArrowDown"></span>}
            </button>
            {isListOpen && (
              <div
                className={`dd-list${searchable ? " searchable" : ""} ${id}`}
                style={list}
              >
                {searchable && (
                  <input
                    ref={this.searchField}
                    className={`dd-list-search-bar ${id}`}
                    style={listSearchBar}
                    placeholder="Search"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => this.filterList(e)}
                  />
                )}
                <div className={`dd-scroll-list ${id}`} style={scrollList}>
                  {this.listItems()}
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

Dropdown.defaultProps = {
  id: "",
  select: undefined,
  searchable: undefined,
  styles: {},
  multiSelect: false,
};

Dropdown.propTypes = {
  id: PropTypes.string,
  styles: PropTypes.shape({
    wrapper: PropTypes.string,
    header: PropTypes.string,
    headerTitle: PropTypes.string,
    list: PropTypes.string,
    listSearchBar: PropTypes.string,
    scrollList: PropTypes.string,
    listItem: PropTypes.string,
    listItemNoResult: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  listData:
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        path: PropTypes.string.isRequired,
      })
    ) | PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  select: PropTypes.shape({ value: PropTypes.string }),
  searchable: PropTypes.bool,
};

export default Dropdown;
