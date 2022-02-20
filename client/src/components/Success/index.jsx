import React from 'react';
import styles from "./styles.module.css";
import { ReactComponent as ThankYou } from './thankYou.svg';

function Success() {
    return (
        <React.Fragment>
            <h1 className={styles.header} data-lead-id="site-header-title">THANK YOU!</h1>
            <div className="main-content">
                <div className={styles.thankYou}>
                    <ThankYou />
                </div>
                <p className={styles.informs} data-lead-id="main-content-body">Thanks for providing us these information</p>
            </div>
        </React.Fragment>
    );
}

export default Success;
