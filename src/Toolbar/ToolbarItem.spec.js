import React from 'react';
import {mount} from 'enzyme';
import ThemeProvider from './../styles/ThemeProvider';
import ToolbarItem from './ToolbarItem';

describe('<ToolbarItem />', function() {
    describe('when rendering a toolbar item', () => {
        beforeEach(() => {
            this.wrapper = mount(
                <ThemeProvider>
                    <ToolbarItem label="Label" style={{height: '60px'}}>
                        <button>Hello World</button>
                    </ToolbarItem>
                </ThemeProvider>
            );
        });
        it('it should render a label with the proper height', () => {
            this.wrapper.find('label').should.have.style('height', '60px');
        });
        it('it should render label text to the proper height', () => {
            this.wrapper.find('label').childAt(0).should.have.style('height', '60px');
        });
        it('it should render a label that wraps correctly when the toolbar is collapsed', () => {
            this.wrapper.find('label').should.have.style('white-space', 'nowrap');
        });
        it('it should render it\'s children in a container with the proper height', () => {
            this.wrapper.find('label').childAt(1).should.have.style('height', '60px');
        });
    });
});