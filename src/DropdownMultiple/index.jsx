import React, { Component } from "react";
import PropTypes from "prop-types";
import pluralize from "pluralize";
import "../styles/global.sass";
import "./index.css";

class DropdownMultiple extends Component {
  constructor(props) {
    super(props);
    const { title, list } = this.props;

    this.state = {
      isListOpen: false,
      title,
      keyword: "",
      selectedItems: [],
      list,
      chkbox: false,
    };

    this.searchField = React.createRef();
  }

  componentDidMount() {
    const { select } = this.props;
    const { list } = this.state;
    // We should not use alert but as we have don't have any error message component. So, I am using it
    if (typeof list[0] !== "object") {
      alert("Wrong Data: Provide Array of objrct for multiSelect Dropdown");
    }
    if (select.length) {
      this.selectMultipleItems(select);
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
    const { list } = nextProps;

    if (JSON.stringify(list) !== JSON.stringify(prevState.list)) {
      return { list };
    }

    return null;
  }

  close = () => {
    this.setState({
      isListOpen: false,
    });
  };

  selectAll = () => {
    const { name, onChange } = this.props;

    this.setState(
      (prevState) => ({
        selectedItems: prevState.list,
      }),
      () => {
        this.handleTitle();
        onChange(this.state.selectedItems, name);
      }
    );
  };

  deselectAll = () => {
    const { name, onChange } = this.props;

    this.setState(
      {
        selectedItems: [],
        chkbox: false,
      },
      () => {
        this.handleTitle();
        onChange(this.state.selectedItems, name);
      }
    );
  };

  selectMultipleItems = (items) => {
    const { list } = this.state;

    items.forEach((item) => {
      const selectedItem = list.find((i) => i.path === item.path);
      setTimeout(() => {
        this.selectItem(selectedItem, true);
      });
    });
  };

  selectItem = (item, noCloseOnSelection = false) => {
    const { closeOnSelection } = this.props;

    this.setState(
      {
        isListOpen: (!noCloseOnSelection && !closeOnSelection) || false,
      },
      () => this.handleSelection(item, this.state.selectedItems)
    );
  };

  handleSelection = (item, selectedItems) => {
    const { name, onChange } = this.props;

    const index = selectedItems.findIndex((i) => i.path === item.path);

    if (index !== -1) {
      const selectedItemsCopy = [...selectedItems];
      selectedItemsCopy.splice(index, 1);
      this.setState(
        () => ({
          selectedItems: selectedItemsCopy,
        }),
        () => {
          onChange(this.state.selectedItems, name);
          this.handleTitle();
        }
      );
    } else {
      this.setState(
        (prevState) => ({
          selectedItems: [...prevState.selectedItems, item],
        }),
        () => {
          onChange(this.state.selectedItems, name);
          this.handleTitle();
        }
      );
    }
  };

  handleTitle = () => {
    const { selectedItems } = this.state;
    const { title, titleSingular, titlePlural } = this.props;
    const selectedValue = [];
    selectedItems.forEach((a) => {
      selectedValue.push(a.path);
    });

    const { length } = selectedItems;

    if (!length) {
      this.setState({
        title,
      });
    } else if (length === 1) {
      this.setState({
        title: `${titleSingular}-${selectedValue.join()} `,
      });
    } else if (titlePlural) {
      this.setState({
        title: ` ${titlePlural}-${selectedValue.join()}`,
      });
    } else {
      const pluralizedTitle = pluralize(titleSingular, length);
      this.setState({
        title: ` ${pluralizedTitle}-${selectedValue.join()}`,
      });
    }
  };

  toggleList = () => {
    this.setState(
      (prevState) => ({
        isListOpen: !prevState.isListOpen,
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

  filterList = (e) => {
    this.setState({
      keyword: e.target.path.toLowerCase(),
    });
  };

  listItems = () => {
    const { id, styles } = this.props;
    const { listItem, listItemNoResult } = styles;
    const { keyword, list, selectedItems } = this.state;

    let tempList = [...list];

    if (keyword.length) {
      tempList = list.filter((item) =>
        item.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (tempList.length) {
      return tempList.map((item) => (
        <button
          type="button"
          className={`dd-list-item ${id}`}
          style={listItem}
          key={item.path}
          onClick={() => this.selectItem(item)}
        >
          {item.title}
          {selectedItems.map(
            (i) => Array.isArray(i) && <span className="checkmark"></span>
          )}
          {selectedItems.some((i) => i.path === item.path) && (
            <span className="checkmark"></span>
          )}
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
    const { id, searchable, styles } = this.props;
    const { isListOpen, title } = this.state;

    const { wrapper, header, headerTitle, list, listSearchBar, scrollList } =
      styles;

    return (
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
            role="list"
            type="button"
            className={`dd-list ${searchable ? " searchable" : ""} ${id}`}
            style={list}
            onClick={(e) => e.stopPropagation()}
          >
            {searchable && (
              <input
                ref={this.searchField}
                className={`dd-list-search-bar ${id}`}
                style={listSearchBar}
                placeholder="Search"
                onChange={(e) => this.filterList(e)}
              />
            )}
            <div className={`dd-scroll-list ${id}`} style={scrollList}>
              <div style={{ float: "left" }}>
                <input
                  type="checkbox"
                  defaultChecked={this.state.chkbox}
                  onChange={this.selectAll}
                />
              </div>
              <div className="clearWrapper">
                <p className="clearText" onClick={this.deselectAll}>
                  clear
                </p>
              </div>

              {this.listItems()}
            </div>
          </div>
        )}
      </div>
    );
  }
}

DropdownMultiple.defaultProps = {
  id: "",
  select: [],
  closeOnSelection: false,
  titlePlural: undefined,
  searchable: undefined,
  styles: {},
};

DropdownMultiple.propTypes = {
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
  titleSingular: PropTypes.string.isRequired,
  titlePlural: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  closeOnSelection: PropTypes.bool,
  searchable: PropTypes.bool,
  select: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
    })
  ),
};

export default DropdownMultiple;
