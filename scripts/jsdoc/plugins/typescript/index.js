/* eslint-disable */
const path = require('path');
const ts = require('typescript');

const typeConverter = require('./type-converter');

exports.handlers = {
  newDoclet(e) {
    const { doclet } = e;

    if (doclet.tags && doclet.tags.length > 0) {
      const categoryTag = doclet.tags.find((tag) => tag.title === 'optional');
      if (categoryTag) {
        doclet.optional = true;
      }
    }

    if (doclet?.name === '_____a') {
      e.defaultPrevented = true;
    }
  },

  beforeParse(e) {
    if (['.ts', '.tsx'].includes(path.extname(e.filename))) {
      // adding const a = 1 ensures that the comments always will be copied,
      // even when there is no javascript inside (just interfaces)
      const result = ts.transpileModule(`const _____a = 1; \n${e.source}`, {
        compilerOptions: {
          target: 'esnext',
          esModuleInterop: true,
          jsx: path.extname(e.filename) === '.tsx' ? 'react' : null
        }
      });

      const types = typeConverter(e.source, e.filename);
      const src = result.outputText;
      e.source = `${types}\n\n${src}`;
    }
  }
};
