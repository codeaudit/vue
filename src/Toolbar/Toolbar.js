import React, {Component, PropTypes} from 'react';

export default class Toolbar extends Component {
    static propTypes = {
        title: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
        titleStyle: PropTypes.object
    };

    static defaultProps = {
        title: null,
        className: '',
        style: {},
        titleStyle: {}
    };

    componentDidMount() {
    }

    render() {
        const {
            children,
            title,
            className,
            style,
            titleStyle
        } = this.props;
        const toolbarStyle = Object.assign({}, Toolbar.defaultStyles.container, style);
        const toolbarTitleStyle = Object.assign({}, Toolbar.defaultStyles.title, titleStyle);
        const toolbarTitle = (title !== null)
            ? <h1 style={toolbarTitleStyle}>{title}</h1>
            : null;

        return (
            <div className={`toolbar ${className}`} style={toolbarStyle}>
                {toolbarTitle}
                <div style={Toolbar.defaultStyles.groups}>
                    {children}
                </div>
            </div>
        );
    }

    static defaultStyles = {
        container: {
            boxSizing: 'border-box',
            display: 'flex',
            width: '100%',
            padding: '0.5rem'
        },
        title: {
            paddingRight: '0.75rem',
            alignSelf: 'center'
        },
        groups: {
            alignSelf: 'center',
            flex: 1
        }
    };
}