import { shallow, configure } from 'enzyme';
import React from 'react';
import '@testing-library/jest-dom';

import Adapter from 'enzyme-adapter-react-16';
import Edit from './EditGame';

configure({ adapter: new Adapter() });

describe('EditGame', () => {
  it('display an image with an alt tag', () => {
    const wrapper = shallow(<Edit />);
    expect(wrapper.find('#thumbnailImg').prop('alt')).toEqual('img');
  });

  it('display an image tag whose ID is imgDisplay with an alt tag', () => {
    const wrapper = shallow(<Edit />);
    expect(wrapper.find('#imgDisplay').prop('alt')).toEqual('upload');
  });
});
