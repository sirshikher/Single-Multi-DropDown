import React, { Component } from "react";
import { Dropdown } from "./DropdownWrapper";
import { MultiSelectColour, SingleSelectColour } from "./mock/data";

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

class App extends Component {
  //Use MultiSelectColour for Multiple Select Dropdown, Use SingleSelectColour for Single Select Dropdown
  state = {
    Colour: MultiSelectColour,
  };

  componentDidMount() {
    window.addEventListener("keydown", this.tabKeyPressed);
    window.addEventListener("mousedown", this.mouseClicked);
  }

  tabKeyPressed = (e) => {
    if (e.keyCode === 9) {
      document.querySelector("body").classList.remove("noFocus");
      window.removeEventListener("keydown", this.tabKeyPressed);
      window.addEventListener("mousedown", this.mouseClicked);
    }
  };

  mouseClicked = () => {
    document.querySelector("body").classList.add("noFocus");
    window.removeEventListener("mousedown", this.mouseClicked);
    window.addEventListener("keydown", this.tabKeyPressed);
  };

  onChange = (item, name) => {
    console.log(item, name);
  };
  render() {
    const { Colour } = this.state;

    return (
      <div className="App">
        <div className="wrapper">
          <Dropdown
            multiSelect={true}
            name="color"
            searchable={false}
            title="Colours"
            listData={Colour}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default App;
