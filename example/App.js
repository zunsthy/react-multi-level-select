import React from 'react';
import update from 'react-addons-update';

import Dropdown from '../src/Dropdown';

import list from './data.json';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: list[0].dataId,
    };
  }
  render() {
    const { selected } = this.state;
    return (
      <div style={{ padding: 15 }}>
        <Dropdown
          list={list}
          defaultSelected={selected}
          defaultText="请选择城市"
          isNodeClickable={item => item.isLeaf}
          onEnter={(select, item, path) => {
            console.log('enter:', select, item, path);
          }}
          onChange={(select, item, path) => {
            console.log('click:', select, item, path);
            this.setState(update(this.state, {
              selected: { $set: select },
            }));
          }}
        />
        <div>
          selected adcode: {selected}
        </div>
      </div>
    );
  }
}

export default App;
