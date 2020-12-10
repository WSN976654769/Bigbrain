import { shallow, configure } from 'enzyme';
import React from 'react';
import '@testing-library/jest-dom';

import Adapter from 'enzyme-adapter-react-16';
import { Login } from './Login';

configure({ adapter: new Adapter() });

describe('Login Button', () => {
  it('should have a login button', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find('button')).toHaveLength(1);
  });
});
