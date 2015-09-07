System.config({
  "baseURL": "/",
  "transpiler": "traceur",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.3",
    "angular-material": "github:angular/bower-material@0.10.0",
    "angular-route": "github:angular/bower-angular-route@1.4.3",
    "angular-translate": "github:angular-translate/bower-angular-translate@2.7.2",
    "angular-translate-loader-static-files": "github:angular-translate/bower-angular-translate-loader-static-files@2.7.2",
    "jquery": "github:components/jquery@2.1.4",
    "lodash": "npm:lodash@3.10.0",
    "traceur": "github:jmcriffey/bower-traceur@0.0.88",
    "traceur-runtime": "github:jmcriffey/bower-traceur-runtime@0.0.88",
    "uikit": "github:uikit/uikit@2.21.0",
    "velocity": "github:julianshapiro/velocity@1.2.2",
    "github:angular-translate/bower-angular-translate-loader-static-files@2.7.2": {
      "angular-translate": "github:angular-translate/bower-angular-translate@2.7.2"
    },
    "github:angular-translate/bower-angular-translate@2.7.2": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-animate@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-aria@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-angular-route@1.4.3": {
      "angular": "github:angular/bower-angular@1.4.3"
    },
    "github:angular/bower-material@0.10.0": {
      "angular": "github:angular/bower-angular@1.4.3",
      "angular-animate": "github:angular/bower-angular-animate@1.4.3",
      "angular-aria": "github:angular/bower-angular-aria@1.4.3",
      "css": "github:systemjs/plugin-css@0.1.13"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "npm:lodash@3.10.0": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    }
  }
});

