import '@testing-library/jest-dom';
import * as ResizeObserverModule from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserverModule.default;
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addEventListener: jest.fn(),
      removeListener: jest.fn(),
      addListener: jest.fn(),
    };
  };
