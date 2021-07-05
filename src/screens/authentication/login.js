/*------------------------------------------------------------------
[React]
-------------------------------------------------------------------*/
import React, {useEffect, useState} from "react";
/*------------------------------------------------------------------
[End React]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[React Helmet]
-------------------------------------------------------------------*/
import {Helmet} from "react-helmet";
/*------------------------------------------------------------------
[End React Helmet]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API]
-------------------------------------------------------------------*/
import { API_GET_PUBLIC, API_SERVER, API_LOGIN, API_UPLOADS } from '../../api';
/*------------------------------------------------------------------
[End API]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[React Router]
-------------------------------------------------------------------*/
import { NavLink, useHistory } from "react-router-dom";
/*------------------------------------------------------------------
[End React Router]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
import {reactLocalStorage} from 'reactjs-localstorage';
/*------------------------------------------------------------------
[End Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Functions]
-------------------------------------------------------------------*/
import { random_character } from "../../functions";
/*------------------------------------------------------------------
[End Functions]
-------------------------------------------------------------------*/

const Screen = ({loading, error, setting}) => {

    /*--------------------------------------------------------------
    [History]
    ----------------------------------------------------------------*/
    const history = useHistory();
    /*--------------------------------------------------------------
    [End History]
    ----------------------------------------------------------------*/
    
    /*--------------------------------------------------------------
    [Storage]
    ----------------------------------------------------------------*/
    let STORAGE_USER_STRINGIFY = reactLocalStorage.get('@user');

	let STORAGE_USER;

	if(STORAGE_USER_STRINGIFY){
		STORAGE_USER = JSON.parse(STORAGE_USER_STRINGIFY)
	}
    /*--------------------------------------------------------------
    [End Storage]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [State]
    ----------------------------------------------------------------*/
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    const [refresh, set_refresh] = useState(false);
    /*--------------------------------------------------------------
    [End State]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [Redirect]
    ----------------------------------------------------------------*/
    if(STORAGE_USER){
        if(STORAGE_USER[0].level === 'super'){
            history.push('/')
        }
    }
    /*--------------------------------------------------------------
    [End Redirect]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [API]
    ----------------------------------------------------------------*/
    const _login = () => {

        if(loading === true){
            return
        }

		loading(true);

        set_refresh(random_character(16))

		API_LOGIN('login__________', {
			username: username,
			password: password
		})
        .then((response) => {
			if(response.data.result === 'success'){
                reactLocalStorage.set('@token', response.data.data);
                reactLocalStorage.set('@user', JSON.stringify(response.data.user));
                set_user(JSON.stringify(response.data.user))
                window.location.reload();
            }else if(response.data.error){
                error(response.data.error)
            }
        })
        .catch((e) => {
			console.log('catch : ', e)
            error(e.message)
        }).finally(() => {
			loading(false)
		})

    }
    /*--------------------------------------------------------------
    [End API]
    ----------------------------------------------------------------*/

	/*--------------------------------------------------------------
	[Browser]
	----------------------------------------------------------------*/
	const _browser = () => {

        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1 - 71
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;

        if(isFirefox){
            error('Detect Firefox : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }else if(isChrome){

        }else if(isSafari){
            error('Detect Safari : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }else if(isOpera){
            error('Detect Opera : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }else if(isIE){
            error('Detect IE : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }else if(isEdge){
            error('Detect Edge : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }else if(isBlink){
            error('Detect Blink : Direkomendasikan menggunakan browser Google Chrome demi mendapatakan pengalaman terbaik')
        }

	}
	/*--------------------------------------------------------------
	[End Browser]
	----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [useEffect]
    ----------------------------------------------------------------*/
    useEffect(() => {

		_browser();

    }, [refresh])
    /*--------------------------------------------------------------
    [useEffect]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [Render]
    ----------------------------------------------------------------*/
    return (
        <>
            <Helmet>

                <meta name="description" content={'Login'}/>
                <title>{'Login'}</title>

            </Helmet>

            <div className="_container_small">
                <div className="_push_b_d _push_t_g">
                    <h1>Login</h1>
                </div>
                <div className="_push_b_d">
                    <div className="_row _center_align">
                        <div className="_push_r_m">
                            <div className="_icon_d">
                                <ion-icon name="finger-print-outline"></ion-icon>
                            </div>
                        </div>
                        <div className="_column">
                            <input
                                className="_input" 
                                placeholder="Username" 
                                onChange={e => set_username(e.target.value)}
                                value={username}
                            />
                        </div>
                    </div>
                </div>
                <div className="_push_b_d">
                    <input
                        className="_input" 
                        placeholder="Password"  
                        type="password"
                        onChange={e => set_password(e.target.value)}
                        value={password} 
                    />
                </div>
                <div className="_push_b_d">
                    <button 
                        className="_btn" 
                        onClick={() => {
                            _login()
                        }}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </>
    );
    /*--------------------------------------------------------------
    [End Render]
    ----------------------------------------------------------------*/

}

export default Screen;