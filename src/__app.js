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
	const [loading, set_loading] = useState(false);
	const [error, set_error] = useState('');
	const [progress, set_progress] = useState('');
	/*--------------------------------------------------------------
	[End State]
	----------------------------------------------------------------*/

	/*--------------------------------------------------------------
	[Progress Upload]
	----------------------------------------------------------------*/
	const _progress_finish = () => {

		setTimeout(() => {
			set_progress('') 
		}, 1500)

	}
	/*--------------------------------------------------------------
	[End Progress Upload]
	----------------------------------------------------------------*/

	/*--------------------------------------------------------------
	[Render]
	----------------------------------------------------------------*/
	return (
		<>

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

			{		
				loading &&
				
				<div className="_loading">
					Loading...
				</div>
			
			}

			{
				progress > 0 ?
				
					<div className="_progressbar">
						<div class="_loader"></div>
						<h1 style={{marginBottom: 20}}><span style={{color: '#118ab2'}}>e-</span>Progress</h1>
						<div className="_item">
							<div className="_item_progress" style={{width: `${progress}%`}}>
								<div className="_percent">{`${progress}%`}</div>
							</div>
						</div>
						{
							progress === 100 ?
								_progress_finish()
							: 
								<p className="_push_t_l">Uploading Files . . .</p>
						}
					</div>

				: null
			
			}

			<Router>
				
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
