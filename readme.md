Electron Icon Generator
======
**Electron Icon Generator** generates icons for your electron app.

[![NPM](https://nodei.co/npm/electron-icon-generator.png)](https://www.npmjs.com/package/electron-icon-generator)

## How to install
```sh
$ npm install -g electron-icon-generator
```

## Usage
```sh
electron-icon-generator /path/to/icon.png
```
> *Note: Please provide a PNG image of 1024x1024 for best results.*

This command will output your icons in the `icons` folder. The structure of the generated `icons` folder will be :-

```sh
icons
├── mac
│   └── app.icns
├── png
│   ├── 1024x1024.png
│   ├── 128x128.png
│   ├── 16x16.png
│   ├── 24x24.png
│   ├── 256x256.png
│   ├── 32x32.png
│   ├── 48x48.png
│   ├── 512x512.png
│   ├── 64x64.png
│   └── 96x96.png
└── win
    └── app.ico
```

# Contribte to this tool

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

### About Me

 * [My website](http://manojsinghnegi.com) (manojsinghnegi.com)
 * [Medium](https://medium.com/@manojsinghnegi) (@manojsinghnegi)
 * [Twitter](http://twitter.com/manojnegiwd) (@manojnegiwd)