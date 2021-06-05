import * as React from 'react';

import { App } from 'app/pages/layout/App';
import { createRenderer } from 'react-test-renderer/shallow';

const renderer = createRenderer();

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(<App />);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
