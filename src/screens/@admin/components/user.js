/*------------------------------------------------------------------
[React]
-------------------------------------------------------------------*/
import React, {useEffect, useState } from "react";
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
import { API_GET_REQUEST, API_POST } from '../../../api';
/*------------------------------------------------------------------
[End API]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
import {encode, decode} from 'html-entities'
/*------------------------------------------------------------------
[End Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Functions]
-------------------------------------------------------------------*/
import { random_character } from '../../../functions'
/*------------------------------------------------------------------
[End Functions]
-------------------------------------------------------------------*/

const Screen = ({loading, error, progress}) => {
    
    /*--------------------------------------------------------------
    [State]
    ----------------------------------------------------------------*/
    const [refresh, set_refresh] = useState(false);
    const [element, set_element] = useState(null);
    const [pagination_active, set_pagination_active] = useState(1);
    const [data, set_data] = useState(null);
    const [search, set_search] = useState('');

    const [level, set_level] = useState('');
    const [name, set_name] = useState('');
    const [username, set_username] = useState('');
    const [password, set_password] = useState('');
    /*--------------------------------------------------------------
    [End State]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [API]
    ----------------------------------------------------------------*/
    const _read = (pages) => {

		let offsetSync;

        if(pages === 1){
            offsetSync = 0;    
        }else{
            offsetSync = pages ? (20 * pages) - 20 : 0
        }

        if(loading === true){
            return
        }
        
        loading(true);

        API_GET_REQUEST('user/get?action=read'
            + '&limit=20'
            + '&offset=' + offsetSync
            , 
		).then((response) => {
            console.log('response : ', response)
            if(response.data.result == 'success'){
                set_data(response.data.data)
			}else if(response.data.error){
				error(response.data.error);
			}
		})
		.catch((e) => {
            console.log('catch : ', e)
            error(e.message)
        }).finally(() => {
            loading(false)
        })

	}

    const _search = () => {

        if(loading === true){
            return
        }
        
        if(search.length > 3){
    
            API_GET_REQUEST('user/get?action=search'
                + '&search=' + search
            , 
            ).then((response) => {
                if(response.data.result == 'success'){
                    set_data(response.data.data)
                    error('')
                }else if(response.data.error){
                    error(response.data.error);
                    set_data(null)
                }
            })
            .catch((e) => {
                console.log('catch : ', e)
                error(e.message)
            }).finally(() => {
                loading(false)
            })

        }

    }

    const _request = (action, id) => {

        if(loading === true){
            return
        }

		loading(true);

		API_POST('user/post', {
            id_user: id,
            action: action,
            level: level,
            name: name,
			username: username,
			password: password
		})
        .then((response) => {
            console.log('response : ', response.data)
			if(response.data.result === 'success'){
                set_element(null)
                set_level('')
                set_name('')
                set_username('')
                set_password('')
                set_refresh(random_character(16))
                error(response.data.title)
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

        if(search.length > 0){
            _search()
        }else{
            _read(pagination_active)
        }

    }, [refresh, search])
    /*--------------------------------------------------------------
    [End useEffect]
    ----------------------------------------------------------------*/

    return (
        <>

            {/* helmet ------------------------------------------- */}
            <Helmet>
                <title>{'User'}</title>
            </Helmet>

            {/* header ------------------------------------------- */}
            <div className="_push_b_d">
                <div className="_row _center_align">
                    <div className="_push_r_m">
                        <div className="_icon_d">
                            <ion-icon name="search-outline"></ion-icon>
                        </div>
                    </div>
                    <div className="_column">
                        <input
                            className="_input" 
                            placeholder="Search" 
                            onChange={e => set_search(e.target.value)}
                            value={search}
                        />
                    </div>
                    <div className="_push_l_m">
                        <button
                            onClick={() => {
                                if(element === 'insert'){
                                    set_element(null)
                                    set_level('')
                                    set_name('')
                                    set_username('')
                                    set_password('')
                                }else{
                                    set_element('insert')
                                }
                            }} 
                            style={{backgroundColor: element === 'insert' ? '#eee' : '#fff'}}
                            className="_btn"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* insert ------------------------------------------- */}
            {
                element === 'insert' ?
                    <div className="_push_b_d">
                        <input
                            className="_input" 
                            placeholder="Level" 
                            onChange={e => set_level(e.target.value)}
                            value={level}
                        />
                        <input
                            className="_input" 
                            placeholder="Name" 
                            onChange={e => set_name(e.target.value)}
                            value={name}
                        />
                        <input
                            className="_input" 
                            placeholder="Username" 
                            onChange={e => set_username(e.target.value)}
                            value={username}
                        />
                        <input
                            type={'password'}
                            className="_input" 
                            placeholder="Password" 
                            onChange={e => set_password(e.target.value)}
                            value={password}
                        />
                        <div className="_push_t_m">
                            <button
                                onClick={() => {
                                    _request('insert')
                                }} 
                                className="_btn">
                                Insert
                            </button>
                        </div>
                    </div>
                : null
            }
            
            {/* table -------------------------------------------- */}
            <div className="_overflow_x">
                <table>
                    <thead>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Password</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {
                            data && data.list.length > 0 ?
                                data.list.map((item, index) => (
                                    <>
                                        <tr key={index}>
                                            <td>{decode(item.name)}</td>
                                            <td>{decode(item.username)}</td>
                                            <td>
                                                <div className="_icon_d">
                                                    <ion-icon name="key-outline"></ion-icon>
                                                </div>
                                            </td>
                                            <td className="_text_overflow">
                                                <button
                                                    onClick={() => {
                                                        if(element === `update_${item.id_user}`){
                                                            set_element(null)
                                                            set_name('')
                                                            set_username('')
                                                        }else{
                                                            set_element(`update_${item.id_user}`)
                                                            set_name(item.name)
                                                            set_username(item.username)
                                                        }
                                                    }}
                                                    style={{backgroundColor: element === `update_${item.id_user}` ? '#eee' : '#fff'}} 
                                                    className="_btn"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if(element === `update_password_${item.id_user}`){
                                                            set_element(null)
                                                        }else{
                                                            set_element(`update_password_${item.id_user}`)
                                                        }
                                                    }}
                                                    style={{backgroundColor: element === `update_password_${item.id_user}` ? '#eee' : '#fff'}} 
                                                    className="_btn _push_l_m"
                                                >
                                                    Update Password
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        _request('delete', item.id_user)
                                                    }} 
                                                    className="_push_l_m _push_r_m _btn">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {
                                            element === `update_${item.id_user}` ?
                                                <tr>
                                                    <td>
                                                        <input
                                                            className="_input"
                                                            placeholder="Name" 
                                                            onChange={e => set_name(e.target.value)}
                                                            value={decode(name)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="_input" 
                                                            placeholder="Username" 
                                                            onChange={e => set_username(e.target.value)}
                                                            value={decode(username)}
                                                        />
                                                    </td>
                                                    <td>

                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                _request('update', item.id_user)
                                                            }} 
                                                            className="_btn">
                                                            Save
                                                        </button>
                                                    </td>
                                                </tr>
                                            : null
                                        }
                                        {
                                            element === `update_password_${item.id_user}` ?
                                                <tr>
                                                    <td></td>
                                                    <td></td>
                                                    <td>
                                                        <input
                                                            className="_input" 
                                                            placeholder="Password" 
                                                            onChange={e => set_password(e.target.value)}
                                                            value={decode(password)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                _request('update_password', item.id_user)
                                                            }} 
                                                            className="_btn">
                                                            Save
                                                        </button>
                                                    </td>
                                                </tr>
                                            : null
                                        }
                                    </>
                                ))
                            : 
                                data &&
                                <tr>
                                    <td colSpan="5">
                                        Data Not Found
                                    </td>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            
            {/* pagination ---------------------------------------- */}
            <div className="_lily_pad_h_d _push_b_d _push_t_d">
                <div className="_pagination">
                    {
                        data && data.pages.map((item, index) => {
                            if(data.pages.length > 1){
                                return (

                                    <div 
                                        key={index} 
                                        className="_item"
                                        style={{backgroundColor: pagination_active === index + 1 ? '#eee' : '#fff'}}
                                        onClick={() => {
                                            _read(index + 1);
                                            set_pagination_active(index + 1)
                                        }}
                                    >
                                        <div className="_center_text">
                                            {item}
                                        </div>
                                    </div>
                                    
                                )
                            }
                        })
                    }
                </div>
            </div>
        </>
    );

}

export default Screen;