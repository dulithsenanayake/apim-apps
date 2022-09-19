import React, { useEffect, Suspense, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthenticatedComponent, BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import Progress from 'AppComponents/Shared/Progress';
import { IntlProvider } from "react-intl";

/**
 * Language.
 * @type {string}
 */
const language = (navigator.languages && navigator.languages[0]) || navigator.language;

function Publisher() {
    const { state, trySignInSilently, signIn, getBasicUserInfo } = useAuthContext();
    const { isAuthenticated, isLoading } = state;
    const [user, setUser] = useState<BasicUserInfo>();

    useEffect(() => {
        if (isAuthenticated || isLoading) {
            return;
        }

        trySignInSilently()
            .then((response: boolean | BasicUserInfo) => {
                if (!response) {
                    signIn();
                }
            })
            .catch(() => {
                signIn();
            });
    }, [isAuthenticated, isLoading]);

    useEffect(() => {
        if (isAuthenticated) {
            getBasicUserInfo().then((basicUserDetails) => {
                setUser(basicUserDetails);
            })
        }
    }, [isAuthenticated]);

    return (
        <div className='App'>
            <IntlProvider locale={language}>
                <Router>
                    <Switch>
                        <Route
                            render={() => {
                                return (
                                    <AuthenticatedComponent fallback={<div>Sign in to view this section.</div>} >
                                        <Suspense fallback={<Progress per={10} message='Loading app ...' />}>
                                            <div>
                                                <h1>{user?.asgardeoUser}</h1>
                                            </div>
                                        </Suspense>
                                    </AuthenticatedComponent>
                                );
                            }}
                        />
                    </Switch>
                </Router>
            </IntlProvider>
        </div >
    );
}
export default Publisher;
