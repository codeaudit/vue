import React from 'react';
import {componentType, oneOfComponentType} from './PropTypes';
import {Toolbar, ToolbarGroup, ToolbarTitle} from './../Toolbar';

describe('utilities/PropTypes/componentType', function() {
    beforeEach(() => {
        this.actual = undefined;
        this.input = undefined;
    });
    describe('given a single component class', () => {
        beforeEach(() => {
            this.input = Toolbar;
        });
        describe('and given a non-children prop that does not match the component class', () => {
            beforeEach(() => {
                this.props = {
                    prop: ToolbarGroup
                };
            });
            describe('when validating that the prop is an instance of the provided component class', () => {
                beforeEach(() => {
                    this.actual = componentType(this.input)(this.props, 'prop', 'My Custom Component');
                });
                it('it should return an error', () => {
                    this.actual.should.be.an.instanceOf(Error);
                    this.actual.message.should.eql('`My Custom Component` prop, `prop`, should be a `Toolbar` component. Check the render method of `My Custom Component`');
                });
            });
        });

        describe('and given a non-children prop that matches the component class', () => {
            beforeEach(() => {
                this.props = {
                    prop: Toolbar
                };
            });
            describe('when validating that the prop is an instance of the provided component class', () => {
                beforeEach(() => {
                    this.actual = componentType(this.input)(this.props, 'prop', 'My Custom Component');
                });
                it('it should not return an error', () => {
                    should.not.exist(this.actual);
                });
            });
        });

        describe('and given children that do not all match the component class', () => {
            beforeEach(() => {
                this.props = {
                    children: [React.createElement(Toolbar), React.createElement(ToolbarGroup)]
                }
            });
            describe('when validating that all the children are instances of the provided component class', () => {
                beforeEach(() => {
                    this.actual = componentType(this.input)(this.props, 'children', 'My Custom Component');
                });
                it('it should return an error', () => {
                    this.actual.should.be.an.instanceOf(Error);
                    this.actual.message.should.equal('`My Custom Component` is only allowed children that are `Toolbar` components. Check the render method of `My Custom Component`');
                });
            });
        });

        describe('and given children that all match the component class', () => {
            beforeEach(() => {
                this.props = {
                    children: [React.createElement(Toolbar), React.createElement(Toolbar)]
                }
            });
            describe('when validating that all the children are instances of the provided component class', () => {
                beforeEach(() => {
                    this.actual = componentType(this.input)(this.props, 'children', 'My Custom Component');
                });
                it('it should not return anything', () => {
                    should.not.exist(this.actual);
                });
            });
        });
    });
});

describe('utilities/PropTypes/oneOfComponentType', function() {
    beforeEach(() => {
        this.actual = undefined;
        this.input = undefined;
    });
    describe('given a collection of component classes', () => {
        beforeEach(() => {
            this.input = [Toolbar, ToolbarTitle];
        });
        describe('and given a non-children prop that does not match any of the component classes', () => {
            beforeEach(() => {
                this.props = {
                    prop: ToolbarGroup
                };
            });
            describe('when validating that the prop is an instance of one of the provided component classes', () => {
                beforeEach(() => {
                    this.actual = oneOfComponentType(this.input)(this.props, 'prop', 'My Custom Component');
                });
                it('it should return an error', () => {
                    this.actual.should.be.an.instanceOf(Error);
                    this.actual.message.should.eql('`My Custom Component` prop, `prop`, should be one of the following component types: `Toolbar`, `ToolbarTitle`. Check the render method of `My Custom Component`');
                });
            });
        });

        describe('and given a non-children prop that matches one of the component classes', () => {
            beforeEach(() => {
                this.props = {
                    prop: Toolbar
                };
            });
            describe('when validating that the prop is an instance of one of the provided component classes', () => {
                beforeEach(() => {
                    this.actual = oneOfComponentType(this.input)(this.props, 'prop', 'My Custom Component');
                });
                it('it should not return anything', () => {
                    should.not.exist(this.actual);
                });
            });
        });

        describe('and given children that do not all match any of the component classes', () => {
            beforeEach(() => {
                this.props = {
                    children: [React.createElement(Toolbar), React.createElement(ToolbarGroup)]
                }
            });
            describe('when validating that all the children are instances of the provided component class', () => {
                beforeEach(() => {
                    this.actual = oneOfComponentType(this.input)(this.props, 'children', 'My Custom Component');
                });
                it('it should return an error', () => {
                    this.actual.should.be.an.instanceOf(Error);
                    this.actual.message.should.equal('`My Custom Component` is only allowed children that are one of the following component types: `Toolbar`, `ToolbarTitle`. Check the render method of `My Custom Component`');
                });
            });
        });

        describe('and given children that all match any of the component classes', () => {
            beforeEach(() => {
                this.props = {
                    children: [React.createElement(Toolbar), React.createElement(Toolbar)]
                }
            });
            describe('when validating that all the children are instances of the provided component class', () => {
                beforeEach(() => {
                    this.actual = oneOfComponentType(this.input)(this.props, 'children', 'My Custom Component');
                });
                it('it should not return anything', () => {
                    should.not.exist(this.actual)
                });
            });
        });
    });
});
