import React, { Component } from 'react';
import ReactModal from 'react-modal';
import css from './LoginModal.module.scss'
import IonIcon from '../IonIcon/IonIcon';

import { BeatLoader } from 'react-spinners';

import { InputNumber } from 'rsuite';

import Utils from "../../Utils"

import { toast, ToastContainer } from 'react-nextjs-toast'

import StoreSingleton from '../../store/CryptodashStoreSingleton'

import LoginForm from "./LoginForm/LoginForm"

import config from '../../config'

import CryptodashApiService from '../../services/cryptodash-api-service'

interface IProps {
    isOpen: boolean,
    onRequestClose: () => void
}

const customStyles = {
    overlay: {
        zIndex: 200,
        backgroundColor: "rgb(12, 17, 23, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        backgroundColor: "transparent",
        position: "initial",
        inset: "0",
        padding: "0",
        border: "0",
        overflow: "unset"
    }
}

export default class MyLoginModal extends React.Component<IProps> {
    state: {
        errorMessage: string,
        isLoading: boolean
    }
    constructor(props) {
        super(props)

        this.state = {
            errorMessage: '',
            isLoading: false
        }
    }

    closeAndReset = () => {
        this.props.onRequestClose()
        this.setState({
            errorMessage: "",
            isLoading: false
        })
    }

    handleLogin = (loginUsername, loginPassword) => {
        this.setState({
            errorMessage: "",
            isLoading: true
        })

        CryptodashApiService.login(loginUsername, loginPassword).then(data => {
            this.setState({ isLoading: false })

            // Pass state to StoreSingleton
            toast.notify(`Succesfully logged in. Welcome to Cryptodash.`, { type: "error", title: "Success" })
            StoreSingleton.setLoggedInUser(data)
            this.closeAndReset()
        }).catch(err => {
            console.log("err")
            console.log(err)
            this.setState({ errorMessage: err.error })
            return
        })
    }

    handleSignup = (signUpUsername, signUpEmail, signUpPassword) => {
        this.setState({
            errorMessage: "",
            isLoading: true
        })

        CryptodashApiService.registerUser(signUpUsername, signUpPassword).then(data => {
            this.setState({ isLoading: false })
            // Pass state to StoreSingleton or show login page
            toast.notify(`Succesfully registered account. Welcome to Cryptodash.`, { type: "success", title: "Success" })
            StoreSingleton.setLoggedInUser({...data, justRegistered: true})
            this.closeAndReset()
        }).catch(err => {
            console.log("err")
            console.log(err)
            this.setState({ errorMessage: err.error })
            return
        })
    }

    render() {
        if (this.props.isOpen) {
            try {
                document.body.classList.add("fixedBodyScroll_login")
            } catch {/* Server side rendering */ }
        }
        else {
            try {
                document.body.classList.remove("fixedBodyScroll_login")
            } catch {/* Server side rendering */ }
        }

        return (
            <div>
                <div id="success-toasts">
                    <ToastContainer align={"right"} />
                </div>
                <ReactModal isOpen={this.props.isOpen} onRequestClose={this.closeAndReset} style={customStyles} ariaHideApp={false}>
                    <div className={css.container}>
                        <div className={css.container__header}>
                            <div>
                                <IonIcon className={css.container__headerIcon} name="close-outline" onClick={this.closeAndReset} />
                            </div>
                            <h2>Login / Create Account</h2>
                        </div>
                        <div className={css.container__body}>
                            <div style={{ height: "34px", color: "#d46d6f", maxWidth: "100%" }}>
                                {this.state.errorMessage || (this.state.isLoading ? <div className="fadeInAnimation"><BeatLoader size={24} color={"#76C9FF"} /></div> : null)}
                            </div>
                            <LoginForm
                                errorEnable={true}
                                errorMessage={""}
                                buttonColor={"#4d789b"}
                                disabledButtonColor={"#2A4357"}
                                buttonHoverColor={"#4d789b"}
                                //buttonHoverColor={"#4d789b"}
                                fontFamily={"'Nunito', sans-serif"}

                                handleSignup={this.handleSignup}
                                handleLogin={this.handleLogin}
                            />
                        </div>
                    </div>
                </ReactModal>
            </div>
        )
    }
}