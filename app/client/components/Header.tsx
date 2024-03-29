import * as React from 'react';
import { useState } from 'react';
import { HeaderProps, HeaderStates } from '../../shared/types';
import CreateAccountMenu from './Menus/CreateAccountMenu';
import LoginMenu from './Menus/LoginMenu';

export default function (props: HeaderProps) {
    const [shownScreen, setShownScreen] = useState(HeaderStates.DEFAULT);

    function renderLoginScreen() {
        setShownScreen(HeaderStates.LOGIN);
    }

    function renderCreateAccountScreen() {
        setShownScreen(HeaderStates.CREATEACCOUNT);
    }

    function closeView(event?: React.SyntheticEvent) {
        if(event === undefined){
            setShownScreen(HeaderStates.DEFAULT);
            return;
        }

        let eventClassName = (event.target as HTMLElement).className;
        let backgroundClass = 'account-menu-wrapper';
        let closeButtonClass = 'account-close-menu-button';
        //Only close the view if the close button or the background was clicked
        if([backgroundClass, closeButtonClass].includes(eventClassName)){
            setShownScreen(HeaderStates.DEFAULT);
        }
    }

    function renderLoginAndCreateAccountButtons() {
        return (
            <div className='header-content-rightjustified-wrapper'>
                <button className='login-button' onClick={renderLoginScreen}>
                    Login
                </button>
                <button className='create-account-button' onClick={renderCreateAccountScreen}>
                    Sign Up
                </button>
            </div>
        )
    }

    async function signOut() {
        await fetch("/api/signOut", {
            method: "POST",
        });
        props.updateAccountStatus(false, "");
        props.returnToHomeScreen();
    }

    function renderSignOutButton () {
        return (
            <div className='header-content-rightjustified-wrapper'>
                <button className='create-account-button' onClick={signOut}>
                    Sign Out
                </button>
            </div>
        );
    }

    return(
        <div className='header'>
            <div className='header-content-wrapper'>
                <div className='game-title' onClick={props.returnToHomeScreen}>
                    <div className='game-title-minesweeper'>
                        chksweeper.com
                    </div>
                </div>
                {props.loggedIn ? renderSignOutButton() : renderLoginAndCreateAccountButtons()}                    
            </div>
            {(shownScreen === HeaderStates.CREATEACCOUNT) && <CreateAccountMenu updateAccountStatus={props.updateAccountStatus} closeView={closeView}/>}
            {(shownScreen === HeaderStates.LOGIN) && <LoginMenu updateAccountStatus={props.updateAccountStatus} closeView={closeView}/>}
        </div>
    );
}
