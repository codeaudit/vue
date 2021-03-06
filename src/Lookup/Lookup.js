// TODO: Fix the instances in this file that break the rule below and remove the disabling of this rule for this file.
/* eslint-disable no-underscore-dangle */
import React, {Component, PropTypes} from 'react';
import isEmpty from 'lodash.isempty';
import {darken, toRgbaString} from '@andrew-codes/color-functions';
import Chip from './../Chip';
import HintText from './../internal/HintText';
import List, {ListItem} from './../List';
import Radium from './../utilities/Radium';
import Popover, {Positions} from './../Popover';
import SubHeader from './../SubHeader';
import ThemeProvider from './../ThemeProvider';
import transparent from './../utilities/Transparent';
import {create} from './../utilities/Transitions';
import {isDescendant} from './../utilities/dom';
import * as Filters from './Filters';
import * as KeyCodes from './../utilities/KeyCodes';

const matchOn = (prop) => (valueToMatch) => (item) => item[prop] === valueToMatch;
const matchOid = matchOn('oid');
const matchesOid = (oid) => matchOid(oid);

const configureGetChipValues = (dataSourceConfig, dataSource) => (oid) => {
    if (!dataSourceConfig) {
        return {
            oid,
            text: dataSource[oid],
        };
    }
    const matchOnOidKey = matchOn(dataSourceConfig.oidKey);
    const itemData = dataSource.find(matchOnOidKey(oid));
    let text;
    if (typeof (dataSourceConfig.renderSelectedItem) === 'string') {
        text = itemData[dataSourceConfig.renderSelectedItem];
    }
    else {
        text = dataSourceConfig.renderSelectedItem(itemData);
    }

    return {
        oid,
        text,
    };
};

class Lookup extends Component {
    static propTypes = {
        /**
         * Background color of selected item chips
         */
        chipBackgroundColor: PropTypes.string,
        /**
         * Text color of selected item chips
         */
        chipColor: PropTypes.string,
        /**
         * Array of all possible date items to be filtered when searching using the lookup; uniqueness is either the index of the item (when an array of strings) or defined by the dataSourceConfig's oidKey
         */
        dataSource: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string,
        ])),
        /**
         * Defines mechanism to convert data source item to: text, rendered list item, and unique key
         */
        dataSourceConfig: PropTypes.shape({
            oidKey: PropTypes.string.isRequired,
            renderItem: PropTypes.func.isRequired,
            renderSelectedItem: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func,
            ]).isRequired,
        }),
        /**
         * If true, the field is 100% width
         */
        fullWidth: PropTypes.bool,
        /**
         * Placeholder text
         */
        hintText: PropTypes.string,
        /**
         * When true, renders without border. Useful for using within other components.
         */
        inline: PropTypes.bool,
        /**
         *
         */
        listHoverBackgroundColor: PropTypes.string,
        /**
         *
         */
        listHoverColor: PropTypes.string,
        /**
         * Minimum number of characters required to be typed before applying the filter to the result set
         */
        minimumNumberOfCharactersToFilter: PropTypes.number,
        /**
         * Event handler which fires upon engaging the Lookup; clicking on it to open
         */
        onActivate: PropTypes.func,
        /**
         * Event handler which fires when Lookup is dis-engaged or closed.
         */
        onDeactivate: PropTypes.func,
        /**
         * Event handler which fires upon the removal of an item from the results list
         */
        onDeselect: PropTypes.func,
        /**
         * Event handler which fires upon the selection of an item from the results list
         */
        onSelect: PropTypes.func,
        /**
         * When true, the auto complete is open
         */
        open: PropTypes.bool,
        /**
         * If provided, will prepend the icon to the Lookup field.
         */
        prependIcon: PropTypes.node,
        /**
         * Header text when one group, otherwise array of groups with header and group filter func
         */
        resultGroups: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.shape({
                filter: PropTypes.func.isRequired,
                header: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.node,
                ]).isRequired,
            })),
        ]).isRequired,
        /**
         * Callback function used to filter the lookup; accepts searchText, value of each item, and its index
         */
        searchFilter: PropTypes.func,
        /**
         * Explicitly set the search text to appear in the lookup
         */
        searchText: PropTypes.string,
        /**
         * Sets the selected values of the lookup; is the string key of the selected object in the data source
         */
        selectedItems: PropTypes.arrayOf(PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ])),
        /**
         * Width of the text field
         */
        width: PropTypes.number,
    };
    static defaultProps = {
        chipBackgroundColor: '#e9edf1',
        chipColor: '#474c54',
        dataSource: [],
        fullWidth: false,
        hintText: '',
        inline: false,
        listHoverBackgroundColor: '#262626',
        listHoverColor: '#fff',
        minimumNumberOfCharactersToFilter: 3,
        onActivate: () => {
        },
        onDeactivate: () => {
        },
        onDeselect: () => {
        },
        onSelect: () => {
        },
        open: false,
        resultGroups: [],
        searchFilter: Filters.none,
        searchText: '',
        selectedItems: [],
        width: 256,
    };
    static contextTypes = {
        theme: PropTypes.shape(ThemeProvider.themeDefinition).isRequired,
    };

    constructor(props, ...rest) {
        super(props, ...rest);

        this.handleChangeTextField = this.handleChangeTextField.bind(this);
        this.handleLookupRootClick = this.handleLookupRootClick.bind(this);
        this.handleItemSelection = this.handleItemSelection.bind(this);
        this.handleClosePopover = this.handleClosePopover.bind(this);
        this.handleChipRemove = this.handleChipRemove.bind(this);
        this.handleTextFieldKeyDown = this.handleTextFieldKeyDown.bind(this);
        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);

        this.setSelectedItem = this.setSelectedItem.bind(this);
        this.getHeight = this.getHeight.bind(this);
        this.getStyles = this.getStyles.bind(this);

        this.renderChip = this.renderChip.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.shouldApplyFilter = this.shouldApplyFilter.bind(this);
        this.combineWithSearchFilter = this.combineWithSearchFilter.bind(this);
        this.renderGroupedResultItems = this.renderGroupedResultItems.bind(this);
        this.applyGroupFilter = this.applyGroupFilter.bind(this);

        this.items = [];

        this.state = {
            open: props.open,
            searchText: props.searchText,
            selectedItems: props.selectedItems,
            width: props.width,
        };
    }

    componentDidMount() {
        const newState = {};
        if (this.props.fullWidth) {
            newState.width = this.getFullWidth();
        }

        this.setState({
            ...newState,
            height: this.getHeight(),
        });
    }

    componentWillReceiveProps(nextProps) {
        const newState = {};
        if (nextProps.fullWidth) {
            newState.height = this.getHeight();
            newState.width = this.getFullWidth();
        }
        else if (this.props.width !== nextProps.width) {
            newState.height = this.getHeight();
            newState.width = nextProps.width;
        }
        if (this.props.searchText !== nextProps.searchText) {
            newState.searchText = nextProps.searchText;
        }
        if (this.props.selectedItems !== nextProps.selectedItems) {
            newState.selectedItems = nextProps.selectedItems;
        }
        this.setState(newState);
    }

    getFullWidth() {
        return parseInt(window
            .getComputedStyle(this.popoverAnchorEl)
            .width
            .replace('px', ''), 10);
    }

    getHeight() {
        return Math.max(
            this.inputField
                .getBoundingClientRect()
                .height,
            this.hintTextWrapper
                .getBoundingClientRect()
                .height
        );
    }

    setSelectedItem(evt, oid) {
        this.setState({
            open: false,
            searchText: '',
            selectedItems: [
                oid,
            ],
        }, () => {
            this.inputField.blur();
        });
        this.props.onSelect(evt, oid);
    }

    handleChangeTextField(evt) {
        this.setState({
            searchText: evt.target.value,
        });
    }

    handleItemSelection(evt, index) {
        const selectedItem = this.items.find((item, itemIndex) => itemIndex === index);
        const selectedOid = selectedItem.oid;
        this.setSelectedItem(evt, selectedOid);
    }

    handleLookupRootClick() {
        this.inputField.focus();
    }

    handleClosePopover(evt, reason) {
        if (isDescendant(this.rootEl, evt.target)) {
            return;
        }
        this.setState({
            open: false,
        });
        this.props.onDeactivate(evt, reason);
    }

    handleChipRemove(evt, oid) {
        evt.stopPropagation();
        this.setState({
            open: false,
            selectedItems: this.state.selectedItems
                .filter(matchesOid(oid)),
        });
        this.props.onDeselect(evt, oid);
    }

    handleTextFieldKeyDown(evt) {
        if (evt.keyCode !== KeyCodes.Tab) {
            return;
        }
        this.setState({
            open: false,
        }, () => {
            this.inputField.blur();
        });
        this.props.onDeactivate(evt);
    }

    handleTextFieldFocus(evt) {
        if (!this.state.open) {
            this.props.onActivate(evt);
        }
        this.setState({
            open: true,
        });
    }

    getStyles() {
        const {
            fullWidth,
            inline,
            prependIcon,
        } = this.props;
        const {
            height,
            open,
            width,
        } = this.state;
        const {
            basicFontFamily,
            fieldBorderColor,
            focusedPrimaryColor,
            normalBackground,
            normalLineHeight,
            normalRadius,
            smallFontSize,
            textPrimaryColor,
            xxSmallGutter,
        } = this.context.theme;
        const darkenCoefficient = 0.55;
        const paddingMultiplier = 2;
        const borderHeight = 2;
        const textHeight = Math.floor(smallFontSize * normalLineHeight);
        const paddingHeight = xxSmallGutter * paddingMultiplier;
        const textFieldHeight = textHeight + paddingHeight + borderHeight;
        const isHintTextMultipleLines = height > textFieldHeight;
        const marginTop = isHintTextMultipleLines ? `${height - textHeight}px` : '0px';
        const hintTextWrapperHeight = isHintTextMultipleLines
            ? (height + paddingHeight + borderHeight)
            : textFieldHeight;
        const computedWidth = fullWidth ? '100%' : `${width}px`;
        const hasIcon = Boolean(prependIcon);
        const borderColor = open ? focusedPrimaryColor : fieldBorderColor;
        let border = {
            borderBottom: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            borderTop: `1px solid ${borderColor}`,
        };
        if (!hasIcon) {
            border.borderLeft = `1px solid ${borderColor}`;
        }
        if (inline) {
            border = {};
        }
        let borderRadius = `${normalRadius}px`;
        if (hasIcon) {
            borderRadius = `0 ${normalRadius}px ${normalRadius}px 0`;
        }

        return {
            hintTextWrapper: {
                background: 'rgba(255,255,255,1)',
                ...border,
                borderRadius: !inline && borderRadius,
                boxSizing: 'border-box',
                height: `${hintTextWrapperHeight}px`,
                padding: `${xxSmallGutter}px`,
                position: 'absolute',
                top: 0,
                width: computedWidth,
            },
            input: {
                background: transparent,
                border: `0px solid ${transparent}`,
                boxSizing: 'border-box',
                color: textPrimaryColor,
                cursor: 'initial',
                fontFamily: basicFontFamily,
                fontSize: `${smallFontSize}px`,
                outline: 'none',
                padding: 0,
                position: 'relative',
                width: '100%',
            },
            inputWrapper: {
                background: transparent,
                border: `1px solid ${transparent}`,
                boxSizing: 'border-box',
                display: 'inline-flex',
                marginTop,
                minWidth: width,
                padding: `${xxSmallGutter}px`,
                width,
                zIndex: 11,
            },
            lookupRoot: {
                background: transparent,
                display: 'flex',
                height: `${hintTextWrapperHeight}px`,
                position: 'relative',
                width: computedWidth,
            },
            paddingForPopover: {
                height: `${hintTextWrapperHeight}px`,
            },
            prependIcon: {
                alignItems: 'center',
                background: open ? focusedPrimaryColor : fieldBorderColor,
                border: `1px solid ${borderColor}`,
                borderRadius: !inline && `${normalRadius}px 0 0 ${normalRadius}px`,
                boxSizing: 'border-box',
                display: 'flex',
                height: `${hintTextWrapperHeight}px`,
                padding: `${xxSmallGutter}px`,
                transition: create('250ms'),
            },
            resultsPaper: {
                background: normalBackground,
                border: `1px solid ${toRgbaString(darken(fieldBorderColor, darkenCoefficient))}`,
                boxSizing: 'border-box',
                width: `${width}px`,
            },
            root: {
                display: 'flex',
                width: computedWidth,
            },
            selectedItems: {
                background: transparent,
                display: 'flex',
                height: `${hintTextWrapperHeight}px`,
                position: 'absolute',
                top: 0,
                width,
                zIndex: 12,
            },
            textFieldWrapper: {
                height: `${textFieldHeight}px`,
                position: 'absolute',
                top: 0,
                width: '100%',
            },
        };
    }

    renderChip(styles) {
        const {
            chipBackgroundColor,
            chipColor,
            dataSource,
            dataSourceConfig,
        } = this.props;
        const {
            selectedItems,
        } = this.state;
        const {
            smallFontSize,
        } = this.context.theme;

        if (isEmpty(selectedItems)) {
            return undefined;
        }

        const getChipValues = configureGetChipValues(dataSourceConfig, dataSource);

        return (
            <div
                style={styles.selectedItems}
            >
                {selectedItems.map((item, index) => (
                    <Chip
                        fullWidth
                        backgroundColor={chipBackgroundColor}
                        color={chipColor}
                        fontSize={smallFontSize}
                        key={index}
                        onRequestRemove={this.handleChipRemove}
                        {...getChipValues(item, index)}
                    />
                ))}
            </div>
        );
    }

    renderListItem(item, index) {
        const {
            dataSourceConfig,
        } = this.props;
        let children = item.value;
        if (dataSourceConfig) {
            children = dataSourceConfig.renderItem(item.value, item.index);
        }

        return (
            <ListItem
                key={index}
            >
                {children}
            </ListItem>
        );
    }

    shouldApplyFilter() {
        return this.state.searchText.length >= this.props.minimumNumberOfCharactersToFilter;
    }

    combineWithSearchFilter(filter) {
        return (searchText, value, index) => filter(value, index)
        && (!this.shouldApplyFilter() || this.props.searchFilter(searchText, value, index));
    }

    applyGroupFilter(dataSource, groupFilter, dataSourceConfig) {
        const filter = this.combineWithSearchFilter(groupFilter);
        return dataSource
            .map((item, index) => ({
                index,
                oid: dataSourceConfig
                    ? item[dataSourceConfig.oidKey] || index
                    : index,
                value: item,
            }))
            .filter((item, index) => filter(this.state.searchText, item.value, index));
    }

    renderGroupedResultItems(groups) {
        const {
            dataSource,
            dataSourceConfig,
        } = this.props;

        if (typeof (groups) === 'string') {
            this.items = [
                {
                    __type: 'SubHeader',
                    header: groups,
                },
            ]
                .concat(this.applyGroupFilter(dataSource, Filters.none, dataSourceConfig));
        }
        else {
            this.items = groups.reduce((output, group) => output
                    .concat([
                        {
                            __type: 'SubHeader',
                            ...group,
                        },
                    ])
                    .concat(this.applyGroupFilter(dataSource, group.filter, dataSourceConfig))
                , []);
        }

        return this.items
            .map((item, index) => {
                if (item.__type === 'SubHeader') {
                    return <SubHeader key={`subheader${index}`}>{item.header}</SubHeader>;
                }
                return this.renderListItem(item, index);
            });
    }

    render() {
        const {
            hintText,
            listHoverBackgroundColor,
            listHoverColor,
            prependIcon,
            resultGroups,
        } = this.props;
        const {
            searchText,
            selectedItems,
            open,
        } = this.state;
        const {
            normalBackground,
        } = this.context.theme;
        const isHintTextHidden = Boolean(searchText) || !isEmpty(selectedItems);
        const styles = this.getStyles();

        return (
            <div
                ref={(el) => {
                    this.rootEl = el;
                }}
                style={styles.root}
            >
                {Boolean(prependIcon) && (
                    <div
                        style={styles.prependIcon}
                    >
                        {React.createElement(prependIcon, {
                            color: normalBackground,
                        })}
                    </div>
                )}
                <div
                    ref={(el) => {
                        this.popoverAnchorEl = el;
                    }}
                    style={styles.lookupRoot}
                    onClick={this.handleLookupRootClick}
                >
                    <div style={styles.paddingForPopover} />
                    {this.renderChip(styles)}
                    <div style={styles.textFieldWrapper}>
                        <div style={styles.hintTextWrapper}>
                            <div
                                ref={(el) => {
                                    this.hintTextWrapper = el;
                                }}
                            >
                                <HintText
                                    hidden={isHintTextHidden}
                                    text={hintText}
                                />
                            </div>
                        </div>
                        <div
                            ref={(el) => {
                                this.inputWrapper = el;
                            }}
                            style={styles.inputWrapper}
                        >
                            <input
                                ref={(el) => {
                                    this.inputField = el;
                                }}
                                style={styles.input}
                                type="text"
                                value={searchText}
                                onChange={this.handleChangeTextField}
                                onFocus={this.handleTextFieldFocus}
                                onKeyDown={this.handleTextFieldKeyDown}
                            />
                        </div>
                    </div>
                    <Popover
                        anchorElement={this.popoverAnchorEl}
                        anchorOrigin={{
                            horizontal: Positions.left,
                            vertical: Positions.bottom,
                        }}
                        open={open}
                        targetOrigin={{
                            horizontal: Positions.left,
                            vertical: Positions.top,
                        }}
                        onRequestClose={this.handleClosePopover}
                    >
                        <div
                            style={styles.resultsPaper}
                        >
                            <List
                                active={open}
                                hoverBackgroundColor={listHoverBackgroundColor}
                                hoverColor={listHoverColor}
                                onSelectItem={this.handleItemSelection}
                            >
                                {this.renderGroupedResultItems(resultGroups)}
                            </List>
                        </div>
                    </Popover>
                </div>
            </div>
        );
    }
}

export default Radium(Lookup);
