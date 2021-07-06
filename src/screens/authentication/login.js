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
    const [refresh, set_refresh] = useState('');
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

		API_LOGIN('login', {
			username: username,
			password: password
		})
        .then((response) => {
            console.log('response : ', response.data)
			if(response.data.result === 'success'){
                reactLocalStorage.set('@token', response.data.data.token);
                reactLocalStorage.set('@user', JSON.stringify(response.data.data.user));
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
    [useEffect]
    ----------------------------------------------------------------*/
    useEffect(() => {



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
                                <ion-icon name="footsteps-outline"></ion-icon>
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
                    <div className="_row _center_align">
                        <div className="_push_r_m">
                            <div className="_icon_d">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                            </div>
                        </div>
                        <div className="_column">
                            <input
                                className="_input" 
                                placeholder="Password"  
                                type="password"
                                onChange={e => set_password(e.target.value)}
                                value={password} 
                            />
                        </div>
                    </div>
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