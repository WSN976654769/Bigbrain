import { shallow, configure } from 'enzyme';
import React from 'react';
import '@testing-library/jest-dom';

import Adapter from 'enzyme-adapter-react-16';
import Register from './Register';

configure({ adapter: new Adapter() });

describe('Register', () => {
  // const noop = () => {};
  it('have four inputs', () => {
    const wrapper = shallow(
      <Register />,
    );
    expect(wrapper.find('input')).toHaveLength(4);
  });
});
