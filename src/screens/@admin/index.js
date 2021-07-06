/*------------------------------------------------------------------
[React]
-------------------------------------------------------------------*/
import React, { useState } from "react";
/*------------------------------------------------------------------
[End React]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[React Helmet]
-------------------------------------------------------------------*/
import { Helmet } from "react-helmet";
/*------------------------------------------------------------------
[End React Helmet]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[React Router]
-------------------------------------------------------------------*/
import { useHistory } from "react-router-dom";
/*------------------------------------------------------------------
[End React Router]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API]
-------------------------------------------------------------------*/
import { API_LOGOUT } from '../../api';
/*------------------------------------------------------------------
[End API]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
import { reactLocalStorage } from 'reactjs-localstorage';
/*------------------------------------------------------------------
[End Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Components]
-------------------------------------------------------------------*/
import User from './components/user'
import Product from './components/product'
/*------------------------------------------------------------------
[End Components]
-------------------------------------------------------------------*/

const Screen = ({loading, error, progress}) => {

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
    const [routes, set_routes] = useState('product');
    /*--------------------------------------------------------------
    [End State]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [Redirect]
    ----------------------------------------------------------------*/
    if(STORAGE_USER !== undefined){
        if(STORAGE_USER[0].level === 'super'){
            history.push('/')
        }
    }else{
        history.push('/login')
    }
    /*--------------------------------------------------------------
    [End Redirect]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [API]
    ----------------------------------------------------------------*/
    const _logout = () => {

        if(loading === true){
            return
        }

        loading(true);

        API_LOGOUT('logout', {
			action: 'logout'
		})
        .then((response) => {
			console.log('response : ', response.data)
            if(response.data.result === 'success'){
                reactLocalStorage.clear();
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

    return (
        <>

            <Helmet>

                <title>{'Admin'}</title>

            </Helmet>

            <div className="_container">
                <div className="_lily_pad_h_d">
                    <div className="_row _center_align _push_t_d _push_b_d">
                        <div className="_column">
                            <h1>Admin</h1>
                        </div>
                        <div className="_push_l_m">
                            <button
                                style={{backgroundColor: routes === 'user' ? '#eee' : '#fff'}}  
                                className="_btn" 
                                onClick={() => {
                                    set_routes('user')
                                }}
                            >
                                User
                            </button>
                        </div>
                        <div className="_push_l_m">
                            <button
                                style={{backgroundColor: routes === 'product' ? '#eee' : '#fff'}} 
                                className="_btn" 
                                onClick={() => {
                                    set_routes('product')
                                }}
                            >
                                Product
                            </button>
                        </div>
                        <div className="_push_l_m">
                            <button 
                                className="_btn" 
                                onClick={() => {
                                    _logout()
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    {
                        STORAGE_USER ?
                            STORAGE_USER[0].level === 'super' ?
                                routes === 'product' ?
                                    <Product
                                        loading={(e) => {loading(e)}}
                                        error={(e) => error(e)}
                                        progress={(e) => progress(e)}  
                                    />
                                : <div>Not Found Route</div>
                            : <div>Not Found Level</div>
                        : <div>Not Found User</div>
                    }
                </div>
            </div>

        </>
    );

}

export default Screen;