import React, {Component, PropTypes} from 'react';
import marked from 'marked';
let renderer = new marked.Renderer();
renderer.image = (href, title, text) => {
    const hrefStartingCharacter = href.charAt(0);
    if (hrefStartingCharacter === '/') {
        return `<img src=".${href}" alt="${text}" />`;
    } else if (hrefStartingCharacter === '.') {
        return `<img src="${href}" alt="${text}" />`;
    } else {
        return `<img src="./${href}" alt="${text}" />`;
    }
};

require('./mui-github-markdown.css');

const styles = {
    root: {
        marginTop: 20,
        marginBottom: 20,
        padding: '0 10px'
    }
};

class MarkdownElement extends Component {

    static propTypes = {
        style: PropTypes.object,
        text: PropTypes.string.isRequired
    };

    static defaultProps = {
        text: ''
    };

    componentWillMount() {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function(code, lang) {
                return require('highlight.js').highlight(lang, code).value;
            },
            renderer
        });
    }

    render() {
        const {
            style,
            text
        } = this.props;

        const textStrippedOfArrayLineBreakFormatting = text.replace(/\[(\n|\r)+/g, '[').replace(/,(\n|\r)+/g, ', ').replace(/(\n|\r)*]\)(\n|\r)*/g, '])');

        /* eslint-disable react/no-danger */
        return (
            <div
                style={Object.assign({}, styles.root, style)}
                className="markdown-body"
                dangerouslySetInnerHTML={{__html: marked(textStrippedOfArrayLineBreakFormatting)}}
            />
        );
        /* eslint-enable */
    }
}

export default MarkdownElement;
