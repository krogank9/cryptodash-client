import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./LoginForm.module.scss";

/*

https://www.npmjs.com/package/react-login-modal

Taken from https://github.com/HasiniWijerathna/react-login-modal and modified
-------------------

MIT License

Copyright (c) 2019 HasiniWijerathna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/**
* Represents the the login sign up functionalities
*/
class Home extends Component {

    /**
    * Class constructor
    * @param {Object} props
    */
    constructor(props) {
        super(props);

        this.state = {
            propStyles: {
                background: this.props.buttonColor,
                borderRadius: 3,
                border: 0,
                color: "white",
                height: 48,
                width: 300,
                padding: "0 30px",
                fontSize: "18px",
                fontFamily: this.props.fontFamily
            },
            font: {
                fontFamily: this.props.fontFamily
            },
            error: {
                open: this.props.errorEnable,
                usernameMessage: "",
                passwordMessage: "",
                confirmPasswordMessage: "",
                emailMessage: "",
                message: this.props.errorMessage
            },
            disabledButton: {
                background: this.props.disabledButtonColor,
                borderRadius: 3,
                border: 0,
                color: "white",
                height: 48,
                width: 300,
                padding: "0 30px",
                fontSize: "18px",
                fontFamily: this.props.fontFamily
            },
            navigatePage: false,
            signUpStyles: {
                color: this.props.buttonColor
            },
            errorMessageStyles: {
                margin: "auto",
                width: "100%",
                paddingBottom: "0px",
                color: "#FF0000",
                font: this.props.fontFamily
            },

            signUpPassword: "",
            signUpUsername: "",
            signUpConfirmPassword: "",
            signUpEmail: "",
            loginUsername: "",
            loginPassword: ""
        };
    }

    /**
     * Handle login page navigation using props
     */
    handleLogin = () => {
        const { loginUsername, loginPassword } = this.state
        this.props.handleLogin(loginUsername, loginPassword);

    }

    /**
     * Hanlde sign up page navigation using props
     */
    handleSignUp = () => {
        const { signUpUsername, signUpEmail, signUpPassword } = this.state
        this.props.handleSignup(signUpUsername, signUpEmail, signUpPassword);

    }

    /**
     * Handle rendering sign up content
     */
    navigateSignup = () => {

        this.setState({
            navigatePage: true
        });
    };

    /**
     * Handle setting login usernmae state
     * @param  {String} event Changer event of the login username
     */
    handleLoginUsername = event => {
        const username = `${event.target.value}`;

        this.setState({
            loginUsername: username
        });
    };

    /**
     * Handle setting login password state
     * @param  {String} event Changer event of the login password
     */
    handleLoginPassword = event => {
        const password = `${event.target.value}`;

        this.setState({
            loginPassword: password
        });
    };

    /**
     * Handle button hover event for mouse enter
     */
    handleButtonHoverEnter = () => {
        const propStyles = {
            ...this.state.propStyles,
            background: this.props.buttonHoverColor
        };
        this.setState({
            propStyles
        });
    };

    /**
     * Handle button hover event for mouse leave
     */
    handleButtonHoverLeave = () => {
        const propStyles = {
            ...this.state.propStyles,
            background: this.props.buttonColor
        };
        this.setState({
            propStyles
        });

    };

    /**
     * Handle sign up button hover for mouse enter
     */
    handleSignUpHoverEnter = () => {
        const signUpStyles = {
            ...this.state.signUpStyles,
            color: this.props.buttonHoverColor
        };
        this.setState({
            signUpStyles
        });
    };

    /**
     * Handle sign up button hover for mouse leave
     */
    handleSignUpHoverLeave = () => {
        const signUpStyles = {
            ...this.state.signUpStyles,
            color: this.props.buttonColor
        };
        this.setState({
            signUpStyles
        });
    };

    /**
    * Handle setting signup username state
    * @param  {String} event Changer event of the signup username
    */
    handleSignupUsername = event => {
        const username = `${event.target.value}`;

        this.setState({
            signUpUsername: username
        });
    };

    /**
     * Handle setting signup password state
     * @param  {String} event Changer event of the signup password
     */
    handleSignupPassword = event => {
        const password = `${event.target.value}`;

        this.setState({
            signUpPassword: password
        });
    };

    /**
     * Handle setting signup email state
     * @param  {String} event Changer event of the signup email
     */
    handleSignupEmail = event => {
        const email = `${event.target.value}`;

        //   error.emailMessage = (password);

        this.setState({
            signUpEmail: email
        });
    };

    /**
     * Handle setting signup confirm password state
     * @param  {String} event Changer event of the signup confirm password
     */
    handleSignupConfirmPassword = event => {
        const confirmPassword = `${event.target.value}`;

        this.setState({
            signUpConfirmPassword: confirmPassword
        });
    };

    /**
    * Describes the elements on the login and sign up
    * @return {String} HTML elements
    */
    render() {
        const {
            propStyles,
            font,
            disabledButton,
            navigatePage,
            signUpStyles,
            signUpPassword,
            signUpConfirmPassword,
            signUpEmail,
            signUpUsername,
            loginUsername,
            loginPassword,
            errorMessageStyles
        } = this.state;

        let loginButton = null;
        let errorText = null;
        let mainContent = null;
        let errorList = null;
        let signupButton = null;

        let enebledSignUpButton = (
            <button
                type="button"
                style={propStyles}
                onClick={this.handleSignUp}
                onMouseEnter={this.handleButtonHoverEnter}
                onMouseLeave={this.handleButtonHoverLeave}
            >
                Sign up
            </button>
        );

        let disbaleSignupButton = (
            <button type="button" style={disabledButton} disabled={true}>
                Sign up
            </button>
        );
        const errorMessage = <div style={errorMessageStyles} ><div style={font}>{errorText}</div></div>;

        const signupEnabled = signUpPassword && signUpUsername
        if (
            !signupEnabled
            //|| !signUpConfirmPassword
            //|| !(signUpPassword === signUpConfirmPassword)
        ) {
            signupButton = disbaleSignupButton;
        } else {
            signupButton = enebledSignUpButton;
        }

        let enebledLoginButton = (
            <button
                type="button"
                style={propStyles}
                onClick={this.handleLogin}
                onMouseEnter={this.handleButtonHoverEnter}
                onMouseLeave={this.handleButtonHoverLeave}
            >
                Login
            </button>
        );

        let disbaleLoginButton = (
            <button type="button" style={disabledButton} disabled={true}>
                Login
            </button>
        );


        const loginEnabled = loginUsername && loginPassword

        if (!loginEnabled) {
            loginButton = disbaleLoginButton;
        } else {
            loginButton = enebledLoginButton;
        }

        const login = (
            <form className={styles.loginContainer} onSubmit={((e) => {e.preventDefault(); if(loginEnabled) this.handleLogin()})}>
                {errorMessage}
                <div className={styles.loginGroup}>
                    <input
                        type="text"
                        required
                        style={font}
                        onChange={this.handleLoginUsername}
                        autoComplete="username"
                    ></input>
                    <label style={font}>Username</label>
                </div>

                <div className={styles.loginGroup}>
                    <input
                        style={font}
                        required
                        type="password"
                        autoComplete="current-password"
                        onChange={this.handleLoginPassword}
                    ></input>
                    <label style={font}>Password</label>
                </div>

                <div style={font}>
                    {loginButton}

                    <div
                        style={signUpContentStyles}
                        onClick={this.navigateSignup}
                        onMouseEnter={this.handleSignUpHoverEnter}
                        onMouseLeave={this.handleSignUpHoverLeave}
                    >
                        Don't have an account? <b style={signUpStyles}>Sign Up</b>
                    </div>
                </div>
                <input type="submit" style={{display: "none"}} />
            </form>
        );

        const signUp = (
            <div>
                <form className={styles.loginContainer} onSubmit={((e) => {e.preventDefault(); if(signupEnabled) this.handleSignUp()})}>
                    {errorList}
                    <div className={styles.loginGroup}>
                        <input
                            type="text"
                            required
                            style={font}
                            autoComplete="username"
                            onChange={this.handleSignupUsername}
                        ></input>
                        <label style={font}>Username</label>
                    </div>

                    <div className={styles.loginGroup}>
                        <input
                            type="text"
                            style={font}
                            placeholder=" "
                            autoComplete="email"
                            onChange={this.handleSignupEmail}
                        ></input>
                        <label style={font}>Email</label>
                    </div>

                    <div className={styles.loginGroup}>
                        <input
                            required
                            style={font}
                            type="password"
                            autoComplete="new-password"
                            onChange={this.handleSignupPassword}
                        ></input>
                        <label style={font}>Password</label>
                    </div>

                    {/*
                    <div className={styles.loginGroup}>
                        <input
                            type="password"
                            required
                            style={font}
                            onChange={this.handleSignupConfirmPassword}
                        ></input>
                        <label style={font}>Confirm Password</label>
                    </div>
                    */}

                    <div style={font}>
                        {signupButton}
                    </div>

                    <input type="submit" style={{display: "none"}} />
                </form>
            </div>
        );

        navigatePage === false ? (mainContent = login) : (mainContent = signUp);

        return <div>{mainContent}</div>;
    }
}

export default Home;

Home.propTypes = {
    buttonColor: PropTypes.string,
    fontFamily: PropTypes.string,
    disabledButtonColor: PropTypes.string,
    buttonHoverColor: PropTypes.string,
    errorMessage: PropTypes.string,
    handleSignup: PropTypes.func,
    handleLogin: PropTypes.func,
    errorEnable: PropTypes.bool
};

Home.defaultProps = {
    buttonColor: "#5264AE",
    buttonHoverColor: "#6373b6",
    disabledButtonColor: "#a8b1d6",
    fontFamily: "Nunito, Roboto, Arial, sans-serif",
    errorMessage: "Username or password is incorrect❓",
    handleLogin: () => console.log('handle login'),
    handleSignup: () => console.log('handle signup'),
    errorEnable: false
};

const signUpContentStyles = {
    margin: "auto",
    width: "80%",
    paddingTop: "40px"
};