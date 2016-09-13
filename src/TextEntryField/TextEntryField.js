import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import * as CustomPropTypes from './../utilities/PropTypes';
import HintText from '../shared/HintText';
import RequiredIndicator from '../shared/RequiredIndicator';

const getStyles = (theme, props, state) => {
    // TODO: pull out into theme/css/etc.
    const height = 48;
    const fontSize = 16;
    const fontFamily = 'Arial';
    const textFieldHeight = 24;
    const padding = theme.TextField.padding || 0;
    const hintTextOffset = state.hintTextHeight - textFieldHeight - (2 * padding);
    const backgroundColor = theme.TextField.backgroundColor || 'transparent';

    const rootDefaultStyles = {
        position: 'relative',
        width: props.fullWidth ? '100%' : `${props.width}px`,
        height: `${height}px`,
        lineHeight: `${textFieldHeight}px`,
        display: 'inline-block',
        transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
    };
    const hintTextDefaultStyles = {
        fontFamily,
        fontSize: `${fontSize}px`
    };
    const inputDefaultStyles = {
        flex: 1,
        width: '100%',
        background: 'rgba(0, 0, 0, 0)',
        border: 'none',
        outline: 'none',
        fontFamily,
        fontSize: `${fontSize}px`,
        position: 'relative',
        cursor: props.disabled ? 'not-allowed' : 'initial'
    };
    const requiredIndicatorDefaultStyles = {
        alignSelf: 'center'
    };

    const underlineDefaultStyles = {
        margin: 0
    };

    const rootRequiredStyles = {
        marginTop: hintTextOffset > 0 ? `${textFieldHeight}px` : 0
    };
    const hintTextRequiredStyles = {
        position: 'absolute',
        top: hintTextOffset > 0 ? `-${hintTextOffset}px` : 0,
        padding,
        backgroundColor,
        boxSizing: 'border-box'
    };
    const inputWrapperRequiredStyles = {
        padding,
        backgroundColor,
        display: 'flex'
    };

    return theme.prepareStyles({
        root: {
            ...rootDefaultStyles,
            ...rootRequiredStyles
        },
        hintText: {
            ...hintTextDefaultStyles,
            ...props.hintTextStyle,
            ...hintTextRequiredStyles
        },
        inputWrapper: inputWrapperRequiredStyles,
        input: inputDefaultStyles,
        requiredIndicator: requiredIndicatorDefaultStyles,
        underline: underlineDefaultStyles
    });
};

class TextEntryField extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        fullWidth: PropTypes.bool,
        hintText: PropTypes.string,
        hintTextStyle: CustomPropTypes.style,
        onChange: PropTypes.func,
        required: PropTypes.bool,
        width: PropTypes.number,
        value: PropTypes.string
    };

    static defaultProps = {
        disabled: false,
        fullWidth: false,
        hintTextStyle: {},
        onChange: () => {
        },
        required: false,
        width: 256,
        value: ''
    };

    static contextTypes = {
        theme: CustomPropTypes.theme
    };

    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            hintTextHeight: 24,
            hasValue: !!props.value
        };
    }

    componentDidMount() {
        this.setState({
            hintTextHeight: findDOMNode(this.refs.hintText).getBoundingClientRect().height
        });
    }

    componentDidReceiveProps(nextProps) {
        this.setState({
            hasValue: !!nextProps.value,
            hintTextHeight: findDOMNode(this.refs.hintText).getBoundingClientRect().height
        });
    }

    render() {
        const styles = getStyles(this.context.theme, this.props, this.state);
        const {disabled, value, hintText, required} = this.props;
        const {hasValue} = this.state;

        return (
            <div style={styles.root}>
                <HintText ref="hintText" text={hintText} style={styles.hintText} hidden={hasValue} onClick={this.focusInput} />
                <div style={styles.inputWrapper}>
                    <input style={styles.input} type="text" ref="inputField" defaultValue={value} onChange={this.handleChange}
                           disabled={disabled} />
                    <RequiredIndicator hidden={!required} style={styles.requiredIndicator} />
                </div>
                <div>
                    <hr style={styles.underline} />
                </div>
            </div>
        );
    }

    handleChange = (evt) => {
        this.setState({
            hasValue: !!evt.target.value
        });
        this.props.onChange && this.props.onChange(evt.target.value);
    };

    focusInput = (evt) => {
        this.refs.inputField.focus();
    };
}
export default TextEntryField;
