# React Multi-Level Dropdown

A Mutliple-Level Dropdown Implement with React.

## USAGE

``` javascript
import Dropdown from './src/Dropdown';
import '../src/Dropdown.css'; // require css-loader

// ...

const App = () => (
  <Dropdown
    list={[]}
    onChange={(selected) => console.log(selected)}
  />
);

// ...
```

## EXAMPLE

``` bash
npm install
npm start

# open http://localhost:8080/example.html in your browser
```

## API

### showDropdown: `bool`

Default: `false`

The dropdown menu **always** show, if `showDropdown` is true.

### list: `arrayOf(shape({ parentId: any, dataId: any, name: string, isLeaf: bool }))`

Default: `[]`

If node is in the first level mene, `parentId` is `null`.

### onChange: `func.isRequired`

`onChange(dataId, item, path): void`

It will be fired on click one node.

### onEnter: `func`

`onEnter(dataId, item, path): void`

It will be fired on mouse enter one node.

### isNodeClickable: `func`

`isNodeClickable(item): bool`

It's used to check nodes if clickable.

### defaultText: `string`

Default: `Select...`

The dropdown holder default show text.

### width: `string|number`

Default: `160`

The dropdown holder default width.

## LICENSE

MPL-2.0
