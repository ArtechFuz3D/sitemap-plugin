# Sitemax

> Generate sitemap.xml & robots.txt automatically for your static site with Vite + GitHub Pages support.

[![npm version](https://img.shields.io/npm/v/sitemax.svg)](https://www.npmjs.com/package/sitemax)
[![License](https://img.shields.io/npm/l/sitemax.svg)](LICENSE)

* Injects SEO meta tags
* Generates `sitemap.xml`
* Generates `robots.txt`
* Works with multi-page static sites

---

## Installation

Install via npm:

```bash
npm install sitemax
```

Or using yarn:

```bash
yarn add sitemax
```

---

## Usage

Import your plugin into your project:

```javascript
// ES Modules
import Sitemax from 'sitemax';

// CommonJS
const Sitemax = require('sitemax');
```

Initialize and use the plugin:

```javascript
const plugin = new Sitemax({
  siteUrl: 'https://your-site.com',
  routes: ['/', '/about', '/contact'],
  generateRobots: true
});

// Example usage
plugin.generateSitemap();
plugin.generateRobots();
```

---

## Options

| Option           | Type    | Default  | Description                        |
| ---------------- | ------- | -------- | ---------------------------------- |
| `siteUrl`        | string  | `''`     | Base URL of your site              |
| `routes`         | array   | `[]`     | Pages to include in sitemap        |
| `outputDir`      | string  | `'dist'` | Directory to output sitemap/robots |
| `generateRobots` | boolean | `false`  | Whether to generate robots.txt     |

---

## Examples

```javascript
// Example 1: Generate both sitemap & robots.txt
plugin.generateSitemap();
plugin.generateRobots();

// Example 2: Custom output directory
const plugin2 = new Sitemax({
  siteUrl: 'https://example.com',
  outputDir: './public',
});
plugin2.generateSitemap();
```

---

## Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT © Neill Hewitt
