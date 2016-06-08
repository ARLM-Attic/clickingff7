System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "traceur",
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "angular": "github:angular/bower-angular@1.4.5",
    "angular-route": "github:angular/bower-angular-route@1.4.5",
    "angular-translate": "github:angular-translate/bower-angular-translate@2.7.2",
    "angular-translate-loader-static-files": "github:angular-translate/bower-angular-translate-loader-static-files@2.7.2",
    "jquery": "github:components/jquery@2.1.4",
    "lodash": "npm:lodash@3.10.1",
    "traceur": "github:jmcriffey/bower-traceur@0.0.91",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.91",
    "uikit": "github:uikit/uikit@2.22.0",
    "velocity": "github:julianshapiro/velocity@1.2.2",
    "github:angular-translate/bower-angular-translate-loader-static-files@2.7.2": {
      "angular-translate": "github:angular-translate/bower-angular-translate@2.7.2"
    },
    "github:angular-translate/bower-angular-translate@2.7.2": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:angular/bower-angular-route@1.4.5": {
      "angular": "github:angular/bower-angular@1.4.5"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:lodash@3.10.1": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});
