import styled from 'styled-components';

export const StyledMenu = styled.div`
  .ant-menu-item-selected {
    background: #a7c9f9;
  }
  .ant-menu-item {
    display: flex;
  }
`;

export const StyledDocViewer = styled.div`
  .docViewer-main > div > div:first-child {
    display: flex !important;
    position: absolute !important;
    right: 0px !important;
    z-index: 2 !important;
    top: -40px !important;
    user-select: none !important;
    background: rgba(255, 255, 255, 0) !important;
    border: none !important;
  }
  .docViewer-main > div > .pan-container {
    width: 50% !important;
    margin: 0 auto;
  }
  .docViewer-main > div > div > div {
    border: none !important;
  }
  .docViewer-main > div > div > div > svg > path,
  polygon {
    stroke: #ffffff !important;
  }
`;
