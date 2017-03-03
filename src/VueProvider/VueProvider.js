import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import {combineReducers, createStore} from 'redux';
import {reducer as uiReducer} from 'redux-ui';
import ThemeProvider from './../ThemeProvider';
import V1Provider from './../V1Provider';

const VueProvider = (props, context) => {
    let store = context.store;
    if (!store) {
        store = createStore(combineReducers({
            ui: uiReducer,
        }));
    }
    return (
        <V1Provider runQuery={props.runQuery}>
            <ThemeProvider theme={props.theme}>
                <Provider store={store}>
                    {props.children}
                </Provider>
            </ThemeProvider>
        </V1Provider>
    );
};
// VueProvider.displayName = 'VueProvider';
VueProvider.propTypes = {
    /**
     * Instance of the VersionOne JavaScript SDK
     */
    runQuery: PropTypes.func,
    /**
     * A redux store with `ui` state segment property.
     */
    store: PropTypes.shape({
        dispatch: PropTypes.func.isRequired,
        getState: PropTypes.func.isRequired,
    }),
    /**
     * Theme to be used with Vue
     */
    theme: PropTypes.shape(ThemeProvider.themeDefinition),
};
VueProvider.defaultProps = {
    runQuery: () => {
        console.warn('You have not specified a runQuery function in `VueProvider`.');
    },
};
export default VueProvider;
