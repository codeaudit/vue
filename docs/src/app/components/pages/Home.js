import React, {Component, PropTypes} from 'react';
import FullWidthSection from '../FullWidthSection';
import RaisedButton from 'material-ui/RaisedButton';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';
import spacing from 'material-ui/styles/spacing';
import typography from 'material-ui/styles/typography';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import {gunSmoke, grey200, darkWhite} from '@versionone/ui/styles/themes/v1Theme/foundations/colors';

class HomePage extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        style: PropTypes.object
    };

    static defaultProps = {
        style: {}
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    homePageHero() {
        const styles = {
            root: {
                backgroundColor: gunSmoke,
                overflow: 'hidden'
            },
            svgLogo: {
                marginLeft: window.innerWidth * 0.5 - 130
            },
            tagline: {
                margin: '16px auto 0 auto',
                textAlign: 'center',
                maxWidth: 575
            },
            label: {
                color: lightBaseTheme.palette.primary1Color
            },
            githubStyle: {
                margin: '16px 32px 0px 8px'
            },
            demoStyle: {
                margin: '16px 32px 0px 32px'
            },
            h1: {
                color: darkWhite,
                fontWeight: typography.fontWeightLight,
                fontSize: 86
            },
            h2: {
                fontSize: 20,
                lineHeight: '28px',
                paddingTop: 19,
                marginBottom: 13,
                letterSpacing: 0
            },
            nowrap: {
                whiteSpace: 'nowrap'
            },
            taglineWhenLarge: {},
            h1WhenLarge: {
                fontSize: 86
            },
            h2WhenLarge: {
                fontSize: 24,
                lineHeight: '32px',
                paddingTop: 32,
                marginBottom: 12
            }
        };

        styles.h2 = Object.assign({}, styles.h1, styles.h2);

        if (this.props.width === LARGE) {
            styles.tagline = Object.assign({}, styles.tagline, styles.taglineWhenLarge);
            styles.h1 = Object.assign({}, styles.h1, styles.h1WhenLarge);
            styles.h2 = Object.assign({}, styles.h2, styles.h2WhenLarge);
        }

        return (
            <FullWidthSection style={styles.root}>
                <div style={styles.tagline}>
                    <h1 style={{
                        ...styles.h1,
                        border: `1px solid ${darkWhite}`,
                        width: '300px',
                        height: '300px',
                        lineHeight: '300px',
                        margin: '0 auto'
                    }}>UI</h1>
                    <h2 style={styles.h2}>
                        A Set of React Components <span style={styles.nowrap}>
            used by <a href="http://VersionOne.com">VersionOne</a>.</span>
                    </h2>
                </div>
            </FullWidthSection>
        );
    }

    homePurpose() {
        const styles = {
            root: {
                backgroundColor: grey200
            },
            content: {
                maxWidth: 700,
                padding: 0,
                margin: '0 auto',
                fontWeight: typography.fontWeightLight,
                fontSize: 20,
                lineHeight: '28px',
                paddingTop: 19,
                marginBottom: 13,
                letterSpacing: 0,
                color: typography.textDarkBlack
            }
        };

        return (
            <FullWidthSection
                style={styles.root}
                useContent={true}
                contentStyle={styles.content}
                contentType="p"
                className="home-purpose">
                VersionOne UI is an open-source and community supported collection of common UI components found withing the
                VersionOne application; built with React. As an open-sourced and community supported project, VersionOne UI is not
                formally supported by VersionOne. VersionOne UI empowers the teams to build with a consistent UI and codebase.
            </FullWidthSection>
        );
    }

    homeContribute() {
        const styles = {
            root: {
                backgroundColor: grey200,
                textAlign: 'center'
            },
            h3: {
                margin: 0,
                padding: 0,
                fontWeight: typography.fontWeightLight,
                fontSize: 22
            },
            button: {
                marginTop: 32
            }
        };

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <h3 style={styles.h3}>
                    Looking to contribute and make this project awesome? <span
                    style={styles.nowrap}>Check out our repo.</span>
                </h3>
                <RaisedButton
                    label="GitHub"
                    primary={true}
                    href="https://github.com/versionone/vue/"
                    style={styles.button} />
            </FullWidthSection>
        );
    }

    render() {
        const {style} = this.props;
        const root = {
            paddingTop: spacing.desktopKeylineIncrement,
            ...style
        };

        return (
            <div style={root}>
                {this.homePageHero()}
                {this.homePurpose()}
                {this.homeContribute()}
            </div>
        );
    }
}

export default withWidth()(HomePage);
