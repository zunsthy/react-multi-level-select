import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';

const isElementIn = (src, dst) => {
  if (src === dst) return true;
  if (src === document || src === window) return false;
  return isElementIn(src.parentNode, dst);
};

const cssLengthX = (n, x) => {
  if (typeof n === 'number') {
    return x(n);
  }
  const mx = n.toString().math(/(\d+(\.\d+))(\D+)/);
  const num = (mx[0].test(/\./) ? parseFloat : parseInt)(mx[0]);
  return `${x(num)}${mx[1]}`;
};

class Dropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      showDropdown: false,
      menus: [null],
      selected: null,
    };

    this.handleClickGlobal = this.handleClickGlobal.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickGlobal);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickGlobal);
  }

  handleClick(dataId, item, path) {
    const { onChange, isNodeClickable, showDropdown } = this.props;

    if (!isNodeClickable || isNodeClickable(item)) {
      this.setState(update(this.state, {
        showDropdown: { $set: Boolean(showDropdown) },
        selected: { $set: dataId },
      }));
      onChange(dataId, item, path);
    } else {
      this.setState(update(this.state, {
        showDropdown: { $set: Boolean(showDropdown) },
      }));
    }
  }

  handleClickGlobal(ev) {
    if (!ev.target) return;
    const { showDropdown } = this.props;
    if (!showDropdown && !isElementIn(ev.target, this.container)) {
      this.setState(update(this.state, {
        showDropdown: { $set: false },
      }));
    }
  }

  renderMenus() {
    const { menus } = this.state;
    const { onEnter, width } = this.props;

    return menus.map((p, level) => {
      const sub = this.props.list.filter(item => item.parentId === p);
      return (
        <ul
          key={level}
          style={{
            left: cssLengthX(width, n => (n + 1) * level),
            width,
          }}
        >
          {sub.map(item => (
            <li
              key={item.dataId}
              className="Multi-Dropdown-item"
              onClick={(ev) => {
                ev.stopPropagation();
                this.handleClick(item.dataId, item, menus.slice(1).concat(item.dataId));
              }}
              onMouseEnter={() => {
                if (onEnter) {
                  onEnter(item.dataId, item, menus.slice(1).concat(item.dataId));
                }
                const newMenus = menus.slice(0, level + 1);
                if (item.isLeaf) {
                  this.setState(update(this.state, {
                    menus: { $set: newMenus },
                  }));
                } else {
                  newMenus[level + 1] = item.dataId;
                  this.setState(update(this.state, {
                    menus: { $set: newMenus },
                  }));
                }
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      );
    });
  }

  renderPlaceHolder() {
    return (
      <div className="Multi-Dropdown-placeholder">
        <span>{this.props.defaultText}</span>
      </div>
    );
  }

  render() {
    const { selected, showDropdown } = this.state;
    const { list, width, height } = this.props;

    const selectedItem = selected ? list.filter(item => item.dataId === selected)[0] : null;

    return (
      <div
        className="Multi-Dropdown-container"
        ref={(el) => { this.container = el; }}
        style={{
          width,
          height,
        }}
      >
        <div
          className="Multi-Dropdown-holder"
          onClick={() => {
            this.setState(update(this.state, {
              showDropdown: { $set: true },
            }));
          }}
        >
          <div>
            {selectedItem !== null ? (
              <span>{selectedItem.name}</span>
            ) : this.renderPlaceHolder()}
          </div>
          <div
            className="Multi-Dropdown-icon-down"
          >
            <i className="fa fa-caret-down" />
          </div>
        </div>

        <div
          className="Multi-Dropdown-menu-container"
          style={{
            minWidth: width,
            top: height,
            right: width,
          }}
        >
          {showDropdown ? this.renderMenus() : null}
        </div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  list: [],
  defaultText: 'Select...',
  width: 160,
  height: 34,
};

const { func, bool, array, number, string, oneOfType } = PropTypes;

Dropdown.propTypes = {
  onEnter: func,
  onChange: func.isRequired,
  isNodeClickable: func,
  showDropdown: bool,
  list: array,
  defaultText: string,
  width: oneOfType([number, string]),
  height: oneOfType([number, string]),
};

export default Dropdown;
