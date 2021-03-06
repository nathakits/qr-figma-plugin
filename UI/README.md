# Figma plugin using Vue

## UI (HTML) for Figma Plugin

`UI` is Vue SPA. Since Figma Plugin supports a single HTML file so SPA is recommended for better experience and configuration. Write the Figma Plugin User Interface using the power of Vuejs.

`UI` has its configuration, follow the readme file and you will get your sample code running.

`src` will hold all the `component`, `assets`, `stores` etc... related to the Figma Plugin UI

---

This plugin sample contains almost everything needed to create a simple Figma Plugin using Vuejs.

---

## Project setup
```BASH
npm install
```

### Compiles and hot-reloads for development
```BASH
npm run serve
```

**Note:** This command will not generate `index.html` file to be used in Figma Plugin. `serve` will spin the localhost to run the app on browser for faster development of the UI side of the plugin.

### Compiles and minifies for production
```BASH
npm run build
```

`build` will create `/dist` directory containing `index.html` this is the file to use as a value of `UI` in plugin's `menifest.json`

---

### Compiles and minifies for production with hot-reloads
```BASH
npm run build-watch
```

Does the work of `build` but with watching the file changes to build again automatically.

If you want to test the UI directly into the Figma Plugin then you need to run `build-watch`

---

**Info:** Have any suggestions, fixes, or another workaround to build better? please, do let me know.

---