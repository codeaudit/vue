import React from 'react';
import {shallow} from 'enzyme';
import ToolbarSpacer from './ToolbarSpacer';

describe('<ToolbarSpacer />', function() {
    describe('when rendering a toolbar spacer', () => {
        beforeEach(() => {
            this.wrapper = shallow(<ToolbarSpacer />);
        });
        it('it should render a single div separator that expands as wide as there is space available', () => {
            this.wrapper.length.should.equal(1);
            this.wrapper.children().length.should.equal(0);
            this.wrapper.should.have.style('flex', '1');
        });
    });
});