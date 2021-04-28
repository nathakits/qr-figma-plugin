<h1 align="center">
	<a href="https://github.com/nathakits/qr-figma-plugin">
		<img src="assets/plugin-file-cover.jpg" alt="QR Generator"/>
	</a>
</h1>

<h4 align="center">
  QR Code is a Figma plugin for generating QR codes and inserting into Figma
</h4>

<p align="center">
  Figma plugin built with Vue.js and Tailwind
</p>

<div align="center">
  <a href="https://www.producthunt.com/posts/qr-coder?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-qr-coder" target="_blank">
    <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=293612&theme=light" alt="QR Coder - Generate QR codes and insert directly into Figma. | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" />
  </a>
</div>

<br>

<!-- ## Download -->
<!-- Install on Figma -->

## Usage
In Figma select main menu -> Plugins -> QR Code

Type in the text field to generate the QR code

### Support types
- Plain text
- URLs (www.example.com)
- Email (mailto:example@gmail.com)
- Phone numbers (tel:+12125551212)

### Coming soon!
- WIFI
- MECARD

## Installation and build setup
The project is separated into 2 sections. The main Figma code and the UI which is based on Vue and Tailwind.

#### For main Figma code
```bash
# install dependencies
$ npm install

# serve in watch mode
$ npm run watch

# build for production
$ npm run build
```

#### For UI
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run serve

# build for production
$ npm run build
```

## [UI Setup](UI/README.md)
Check out [instruction to setup Figma Plugin UI](UI/README.md)

## Figma setup guide
You can find instructions at: https://www.figma.com/plugin-docs/setup/

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Credit
-  https://github.com/kozakdenys/qr-code-styling

## License
MIT [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
