const fs = require("fs-extra");
const concat = require("concat");
const path = require("path");

const build = async () => {
  const files = [
    "./dist/pdf-player-wc/runtime.js",
    "./dist/pdf-player-wc/polyfills.js",
    "./dist/pdf-player-wc/vendor.js",
    "./dist/pdf-player-wc/main.js"
  ];

  const outputDir = "web-component/assets/pdf-player";
  const packageJsonSource = "web-component/package.json";

  // Backup package.json if it exists
  let packageJsonContent = null;
  if (await fs.pathExists(packageJsonSource)) {
    packageJsonContent = await fs.readJson(packageJsonSource);
  }

  // Clean and create directory
  await fs.remove("web-component");
  await fs.ensureDir(outputDir);

  // Copy all web component files to assets/pdf-player/
  await concat(files, `${outputDir}/sunbird-pdf-player.js`);
  await fs.copy("./dist/pdf-player-wc/styles.css", `${outputDir}/styles.css`);

  // Copy assets contents (pdfjs, svgs) to assets/pdf-player/
  await fs.copy("./dist/pdf-player-wc/assets", outputDir);

  // // Restore package.json to web-component root
  if (packageJsonContent) {
    await fs.writeJson(packageJsonSource, packageJsonContent, { spaces: 2 });
    console.log("✅ package.json restored to web-component/");
  }
  // else {
  //   // Create default package.json if it didn't exist
  //   const defaultPackageJson = {
  //     "name": "@project-sunbird/sunbird-pdf-player-web-component",
  //     "version": "1.6.0",
  //     "description": "The web component package for the sunbird pdf player",
  //     "main": "assets/pdf-player/sunbird-pdf-player.js",
  //     "scripts": {
  //       "test": "echo \"Error: no test specified\" && exit 1"
  //     },
  //     "homepage": "https://github.com/Sunbird-Knowlg/sunbird-pdf-player/blob/release-5.5.0/README.md",
  //     "repository": {
  //       "type": "git",
  //       "url": "https://github.com/Sunbird-Knowlg/sunbird-pdf-player.git"
  //     },
  //     "keywords": [
  //       "sunbird",
  //       "pdf",
  //       "player",
  //       "web-component"
  //     ],
  //     "author": "sunbird",
  //     "license": "MIT"
  //   };
  //   await fs.writeJson(packageJsonSource, defaultPackageJson, { spaces: 2 });
  //   console.log("✅ package.json created in web-component/");
  // }

  // Also copy to demo folder with same structure
  const demoDir = "web-component-demo/assets/pdf-player";
  await fs.remove("web-component-demo/assets");
  await fs.ensureDir(demoDir);
  await concat(files, `${demoDir}/sunbird-pdf-player.js`);
  await fs.copy("./dist/pdf-player-wc/styles.css", `${demoDir}/styles.css`);
  await fs.copy("./dist/pdf-player-wc/assets", demoDir);

  console.log("✅ Files organized successfully!");
  console.log(`📁 Output: ${outputDir}/`);
};
build();