// Use CommonJS in Jest setup to avoid ESM parse issues
require("@testing-library/jest-dom");

// Mock Next.js Image to a simple img for jsdom tests
jest.mock("next/image", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: (props) => {
      // Drop Next-specific props like fill that <img> doesn't support
      const {
        fill,
        loader,
        unoptimized,
        priority,
        placeholder,
        blurDataURL,
        ...rest
      } = props || {};
      return React.createElement("img", rest);
    },
  };
});

// Mapbox in tests: provide a minimal global to avoid runtime checks if components get imported in tests
// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.mapboxgl = globalThis.mapboxgl || {
  LngLatBounds: function () {
    this.extend = function () {};
  },
};
