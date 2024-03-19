import type { AstroIntegration } from "astro";

import generateContent from './content';
import compressContent from './tarball';

export default (): AstroIntegration => ({
  name: "build-useable-content",
  hooks: {
    "astro:config:done": ({ logger }) => {
      generateContent(logger);
      compressContent(logger);
    },
  },
});
