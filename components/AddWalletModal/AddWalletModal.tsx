import React, { Component } from 'react';
import ReactModal from 'react-modal';
import css from './AddWalletModal.module.scss'
import IonIcon from '../IonIcon/IonIcon';

//import 'rsuite/dist/rsuite.min.css'

import { InputNumber } from 'rsuite';

import Utils from "../../Utils"


interface IProps {
    isOpen: boolean,
    onRequestClose: () => void
}
interface IState {
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
    }
}

export default class AddWalletModal extends React.Component<IProps, IState> {
    closeAndReset = () => {
        this.props.onRequestClose()
    }

    render() {
        if (this.props.isOpen) {
            try {
                document.body.classList.add("fixedBodyScroll")
            } catch {/* Server side rendering */ }
        }
        else {
            try {
                document.body.classList.remove("fixedBodyScroll")
            } catch {/* Server side rendering */ }
        }

        return (
            <div>
                <ReactModal isOpen={this.props.isOpen} onRequestClose={this.closeAndReset} style={customStyles}>
                    <div className={css.container}>
                        <div className={css.container__header}>
                            <h2>Add Wallet</h2>
                            <IonIcon className={css.container__headerIcon} name="close-outline" onClick={this.closeAndReset} />
                        </div>
                        <div className={css.container__body}>
                            <div>
                                <InputNumber defaultValue={1.00} className={css.rsInputNumber} />
                                <input type="text" />
                            </div>
                            <div>
                                <button onClick={() => this.props.onRequestClose()}>Cancel</button>
                                <button onClick={() => this.props.onRequestClose()}>Add to wallets</button>
                            </div>
                        </div>
                    </div>
                </ReactModal>
            </div>
        )
    }
}