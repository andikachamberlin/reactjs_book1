/*------------------------------------------------------------------
[React]
-------------------------------------------------------------------*/
import React, {useEffect, useState} from "react";
/*------------------------------------------------------------------
[End React]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[React Router]
-------------------------------------------------------------------*/
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
/*------------------------------------------------------------------
[End React Router]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Storeage]
-------------------------------------------------------------------*/
import {reactLocalStorage} from 'reactjs-localstorage';
/*------------------------------------------------------------------
[End Storage]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API]
-------------------------------------------------------------------*/
import { API_GET_PUBLIC, API_GET_REQUEST } from './api';
/*------------------------------------------------------------------
[End API]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Screen]
-------------------------------------------------------------------*/
import AdminScreen from "./screens/@admin";
import LoginScreen from "./screens/authentication/login";
import RegisterScreen from "./screens/authentication/register";

import TestScreen from "./screens/@test";

import NotFoundScreen from "./screens/404";
/*------------------------------------------------------------------
[Functions]
-------------------------------------------------------------------*/
import { random_character } from "./functions";
/*------------------------------------------------------------------
[End Functions]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Style]
-------------------------------------------------------------------*/
import './style/general/node.general.css';
import './style/style/node.style.css';
/*------------------------------------------------------------------
[End Style]
-------------------------------------------------------------------*/

const App = () => {

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
	const [refresh, set_refresh] = useState('');
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState('');
	const [progress, set_progress] = useState('');

	const [setting, set_setting] = useState('');
	const [home, set_home] = useState('');
	/*--------------------------------------------------------------
	[End State]
	----------------------------------------------------------------*/

	const _home = () => {

		set_loading(true);

		API_GET_PUBLIC('client/home__________')
        .then((response) => {
			if(response.data.result === 'success'){
				// console.log('home : ', response.data)
                set_home(response.data.data)
            }else if(response.data.error){
                set_error(response.data.error)
            }
        })
        .catch((e) => {
			console.log('catch : ', e)
            set_error(e.message)
        }).finally(() => {
			set_loading(false)
		})

    }
	/*--------------------------------------------------------------
	[End API]
	----------------------------------------------------------------*/

	/*--------------------------------------------------------------
	[Error]
	----------------------------------------------------------------*/
	const _error = (errorParams) => {

		if(errorParams){
			
			if(errorParams.length > 0){
				setTimeout(() => {
					set_error('')
				}, 7000);
			}

		}

	}

	_error(error);
	/*--------------------------------------------------------------
	[End Error]
	----------------------------------------------------------------*/

	const _progress_finish = () => {

		setTimeout(() => {
			set_progress('') 
		}, 1500)

	}

	/*--------------------------------------------------------------
	[useEffect]
	----------------------------------------------------------------*/
    useEffect(() => {

		_error();

    }, [refresh])
	/*--------------------------------------------------------------
	[End UseEffect]
	----------------------------------------------------------------*/

	/*--------------------------------------------------------------
	[Render]
	----------------------------------------------------------------*/
	return (
		<>
			<Router>

				{
					error && error.length > 0 &&
					<div className="_error">
						<div className="_container">
							<div className="_row _center_align">
								<div className="_column">
									{error}
								</div>
								<div className="_push_l_m">
									<div onClick={() => {
										set_error('')
									}} className="_icon_d">
										<ion-icon name="close-outline"></ion-icon>
									</div>
								</div>
							</div>
						</div>
					</div>
				}
				
				<Switch>
					
					{/* authentication */}
					<Route path="/login">
						<LoginScreen 
							loading={(e) => {set_loading(e)}}
							error={(e) => set_error(e)} 
						/>
					</Route>
		
					<Route path="/register">
						<RegisterScreen 
							loading={(e) => {set_loading(e)}}
							error={(e) => set_error(e)} 
						/>
					</Route>

					{/* system */}
					<Route exact path="/">
						<AdminScreen
							loading={(e) => {set_loading(e)}}
							error={(e) => set_error(e)}
							progress={(e) => set_progress(e)}
						/>
					</Route>
					
					{/* system */}
					<Route path="/test">
						<TestScreen 
							loading={(e) => {set_loading(e)}}
							error={(e) => set_error(e)}
							progress={(e) => set_progress(e)} 
						/>
					</Route>

					{/* default */}
					<Route>
						<NotFoundScreen />
					</Route>
				</Switch>

			</Router>
		</>
	);
	/*--------------------------------------------------------------
	[End Render]
	----------------------------------------------------------------*/
	
}

export default App;
