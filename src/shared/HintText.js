import React, {Component, PropTypes} from 'react';
import * as CustomPropTypes from '../utilities/PropTypes';

const getStyles = (theme, props) => {
    // TODO: pull out into theme/css/etc.
    const color = 'rgba(0, 0, 0, 0.298039)';

    return {
        root: {
            color,
            width: '100%',
            ...props.style
        },
        text: {
            opacity: props.hidden ? 0 : 1,
            transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        }
    };
};

class HintText extends Component {
    static propTypes = {
        hidden: PropTypes.bool,
        onClick: PropTypes.func,
        text: PropTypes.string,
        style: CustomPropTypes.style
    };

    static defaultProps = {
        hidden: false,
        onClick: () => {
        },
        text: '',
        style: {}
    };

    render() {
        const {text, onClick, hidden, ...rest} = this.props;
        const styles = getStyles(this.context.theme, this.props);
        return (
            <div style={styles.root} onClick={onClick} {...rest}><span style={styles.text}>{text}</span></div>
        );
    }
}
export default HintText;
