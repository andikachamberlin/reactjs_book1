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
import { API_GET_REQUEST, API_SERVER, API_SCT, API_URL } from '../../../api';
/*------------------------------------------------------------------
[End API]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
import axios from 'axios'
import {reactLocalStorage} from 'reactjs-localstorage';
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
    [Storage]
    ----------------------------------------------------------------*/
    let STORAGE_TOKEN = reactLocalStorage.get('@token');
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
    const [refresh, set_refresh] = useState(false);
    const [file, set_file] = useState(null);
    const [element, set_element] = useState(null);
    const [pagination_active, set_pagination_active] = useState(1);
    const [data, set_data] = useState(null);
    const [search, set_search] = useState('');

    const [name, set_name] = useState('');
    const [price, set_price] = useState('');
    const [category, set_category] = useState('');
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
                    // console.log(JSON.stringify(response.data.data.list, undefined, 2))
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

        let action_sync = action;

        if(action_sync == 'insert'){
            action_sync = 'insert'
        }else if(action_sync == 'update'){
            if(file !== null){
                action_sync = 'update_file'
            }else{
                action_sync = 'update_text'
            }
        }else if(action_sync == 'delete'){
            action_sync = 'delete'
        }else{
            action_sync = null
        }

        console.log('action sync : ', action_sync)

        if(loading === true){
            return
        }

        loading(true);

        var data = new FormData();
        data.append("sct", API_SCT);
        data.append("key", STORAGE_USER[0].id_key);
        data.append("action", action_sync);
        data.append("id_product", id);
        data.append("name", name);
        data.append("price", price);
        data.append("category", category);


        if(file !== null){
            file.map((item) => (
                data.append("file", item)
            ))
        }

        var config = {
            method: 'post',
            url: API_URL + "product/post",
            headers: { 
                'Authorization': `Bearer ${STORAGE_TOKEN}`,
            },
            data : data,
            onUploadProgress: progressEvent => {
                if(file !== null){
                    console.log('loaded : ', progressEvent.loaded)
                    console.log('total : ', progressEvent.total)
                    progress(parseInt(Math.round((progressEvent.loaded/progressEvent.total) * 100)))
                }
            }
        };

        axios(config)
        .then((response) => {
            console.log('response : ', response.data);
            if(response.data.result === 'success'){
                set_file(null)
                set_element(null)
                set_name('')
                set_price('')
                set_category('')
                set_refresh(random_character(16))
                error(response.data.title)
            }else if(response.data.error){
                error(response.data.error)
            }
        })
        .catch((e) => {
            console.log('catch : ', e)
            error(e.message)
        })
        .finally(() => {
			loading(false);
		})

    }
    /*--------------------------------------------------------------
    [End API]
    ----------------------------------------------------------------*/

    /*--------------------------------------------------------------
    [Functions]
    ----------------------------------------------------------------*/
    const _files = (event) => {

        if(!event){
            return error('File not found')
        }
        
        if(event){
            if(!event.target.files[0]){
                return error('File Canceled')
            }
            
            if(event.target.files[0].size > 2048000){
                return error('Maximum File Size 2MB')
            }else{
                error('')
            }
        }

        let foo = event.target.files[0]; 

        set_file([foo]);

	};
    /*--------------------------------------------------------------
    [End Functions]
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
                                    set_file(null)
                                    set_name('')
                                    set_price('')
                                    set_category('')
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
                            placeholder="Name" 
                            onChange={e => set_name(e.target.value)}
                            value={name}
                        />
                        <input
                            className="_input" 
                            type={'number'}
                            placeholder="Price" 
                            onChange={e => set_price(e.target.value)}
                            value={price}
                        />
                        <input
                            className="_input" 
                            placeholder="Category" 
                            onChange={e => set_category(e.target.value)}
                            value={category}
                        />
                        <input
                            className="_input" 
                            type="file"
                            name="file"
                            placeholder=""
                            onChange={_files}
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
                        <th>Level</th>
                        <th>Status</th>
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
                                            <td>{decode(item.level)}</td>
                                            <td>{decode(item.status)}</td>
                                            <td>{decode(item.name)}</td>
                                            <td>{decode(item.username)}</td>
                                            <td>{decode(item.password)}</td>
                                            <td className="_text_overflow">
                                                <button
                                                    onClick={() => {
                                                        set_element(`update_${item.id_product}`)
                                                        set_name(item.name)
                                                        set_price(item.price)
                                                        set_category(item.category)
                                                    }}
                                                    style={{backgroundColor: element === `update_${item.id_product}` ? '#eee' : '#fff'}} 
                                                    className="_btn"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        _request('delete', item.id_product)
                                                    }} 
                                                    className="_push_l_m _push_r_m _btn">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        {
                                            element === `update_${item.id_product}` ?
                                                <tr>
                                                    <td>
                                                        <input
                                                            className="_input" 
                                                            type="file"
                                                            name="file"
                                                            placeholder=""
                                                            onChange={_files}
                                                        />
                                                    </td>
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
                                                            type={'number'}
                                                            placeholder="Price" 
                                                            onChange={e => set_price(e.target.value)}
                                                            value={decode(price)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="_input" 
                                                            placeholder="Category" 
                                                            onChange={e => set_category(e.target.value)}
                                                            value={decode(category)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => {
                                                                _request('update', item.id_product)
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