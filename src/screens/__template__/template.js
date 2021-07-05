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
import { API_GET_REQUEST, API_SERVER, API_SCT } from '../../../api';
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
        
        loading(true);

        API_GET_REQUEST('source__________?action=read'
            + '&limit=20'
            + '&offset=' + offsetSync
        , 
		).then((response) => {
            if(response.data.result == 'success'){
                console.log(JSON.stringify(response.data.data, undefined, 2))
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

    const _delete = (id) => {

		if(loading === true){
            return
        }

        loading(true);

        API_GET_REQUEST('web__________?action=delete_gallery'
            + '&id=' + id
        , 
		).then((response) => {
            if(response.data.result == 'success'){
                console.log(JSON.stringify(response.data.data, undefined, 2))
                set_refresh(random_character(16))
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
        
        if(search.length > 3){
    
            API_GET_REQUEST('source__________?action=search'
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

    const _uploads = () => {

        if(file === null){
            return error('Tidak ada file')
        }

        if(loading === true){
            return
        }

        loading(true);

        var data = new FormData();
        data.append("sct", API_SCT);
        data.append("key", STORAGE_USER[0].id_key);

        file.map((item) => (
            data.append("file", item)
        ))

        var config = {
            method: 'post',
            url: API_SERVER + "/api/v1.0/source/insert__________",
            headers: { 
                'Authorization': `Bearer ${STORAGE_TOKEN}`,
            },
            data : data,
            onUploadProgress: progressEvent => {
                console.log('loaded : ', progressEvent.loaded)
                console.log('total : ', progressEvent.total)
                progress(parseInt(Math.round((progressEvent.loaded/progressEvent.total) * 100)))
            }
        };

        axios(config)
        .then((response) => {
            if(response.data.result === 'success'){
                console.log('results : ', JSON.stringify(response.data));
                set_file(null)
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
            return error('Terjadi Kesalahan')
        }
        
        if(event){
            if(!event.target.files[0]){
                return error('File Dibatalkan')
            }
            
            if(event.target.files[0].size > 2048000){
                return error('Ukuran File maxsimal 2MB')
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
            _read()
            set_pagination_active(1)
        }

    }, [refresh, search])
    /*--------------------------------------------------------------
    [End useEffect]
    ----------------------------------------------------------------*/

    return (
        <>

            <Helmet>

                <meta name="description" content={'description'}/>
                <title>{'title'}</title>

            </Helmet>

            <div className="_row _center_align">
                <div className="_column">
                    <h1 style={{marginBottom: 30}}><span style={{color: '#118ab2'}}>e-</span>Web</h1>
                </div>
            </div>
            <div className="_row _center_align _push_b_d">
                <ion-icon name="leaf-outline" style={{fontSize: 20}}></ion-icon>
                <p className="_push_l_m">Kendali penuh untuk mengatur bagian pengaturan web</p>
            </div>

            <div className="_font_size_20px _push_b_d _push_t_d">Maintenance</div>

            {/* <div class="_row _center_align">
                <div class="_column">

                </div>
                <div class="_column">
                    
                </div>
            </div> */}

            {/* <div onClick={() => {
                if(element === 'overlay'){
                    set_element(null)
                }else{
                    set_element('overlay')
                }
            }} className="_btn _cursor_pointer">
                fmc overlay btn
            </div>

            {
                element === 'overlay' ?
                    <>
                        <div className="_fmc_overlay">
                            <div className="_fmc_overlay_navbar">
                                <div class="_row _center_align">
                                    <div className="_column">
                                        <p className="_font_size_18px">Overlay</p>
                                    </div>
                                    <div onClick={() => {
                                        if(element === 'overlay'){
                                            set_element(null)
                                        }else{
                                            set_element('overlay')
                                        }
                                    }} className="_push_l_d _btn _cursor_pointer">
                                        Keluar
                                    </div>
                                </div>
                            </div>
                            <div className="_fmc_overlay_content">

                            </div>
                        </div>
                    </>
                : null
            }

            <div className="_relative">
                <div onClick={() => {
                    if(element === 'overlay_dropdown'){
                        set_element(null)
                    }else{
                        set_element('overlay_dropdown')
                    }
                }} className="_btn _cursor_pointer">
                    <div className="_row _center_align">
                        <div className="_column">
                            fmc overlay dropdown btn
                        </div>
                        <div className="_push_l_m _push_t_t">
                            {
                                element === 'overlay_dropdown' ?
                                    <ion-icon name="chevron-up-outline"></ion-icon>
                                :
                                    <ion-icon name="chevron-down-outline"></ion-icon>
                            }
                        </div>
                    </div>
                </div>
                {
                    element === 'overlay_dropdown' ?
                        // _left or _right
                        <>
                            <div className="_fmc_overlay_dropdown _left">
                                <div onClick={() => {}} className="_item">1. oke</div>
                                <div onClick={() => {}} className="_item">1. oke</div>
                                <div onClick={() => {}} className="_item">1. oke</div>
                                <div onClick={() => {}} className="_item">1. oke</div>
                            </div>
                        </>
                    : null
                }
            </div>

            <div className="_relative _push_b_m">
                <p style={{color: '#888', fontSize: 13}}>
                    <ion-icon name="ellipse-outline" style={{marginRight: 8, fontSize: 12}}></ion-icon>
                    Input
                </p>
                <div className="_e_input">
                    <input 
                        placeholder=""
                        type={'text'} 
                        // onChange={e => set_input(e.target.value)}
                        // value={input}
                    />
                </div>
            </div>

            <div className="_bb-input" style={{paddingBottom: 10, paddingTop: 10}}>
                                    
                <input
                    className="custom-file-input" 
                    type="file"
                    name="file"
                    placeholder=""
                    onChange={_files}
                />

            </div>

            <div onClick={() => {
                _uploads()
            }} class="_btn _cursor_pointer">
                Simpan
            </div>

            <div className="_bb_search" style={{backgroundColor: 'transparent'}}>
                <div className="_row _center_align">
                    <ion-icon name="search-outline" style={{fontSize: 20}}></ion-icon>
                    <div className="_column">
                        <input 
                            placeholder="Cari File" 
                            onChange={e => set_search(e.target.value)}
                            value={search}
                        />
                    </div>
                </div>
            </div>

            <div className="_overflow_x">
                <table className="_table">
                    <thead>
                        <th style={{width: 60}}><ion-icon name="rocket-outline" style={{fontSize: 22}}></ion-icon></th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>
                            <div className="_right_text">
                                <ion-icon name="magnet-outline" style={{fontSize: 24}}></ion-icon>
                            </div>
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div className="_lily_pad_h_d _push_b_d _push_t_d">
                <div className="__pagination">
                    {
                        data&&data.pages.map((item, index) => {
                            if(data.pages.length > 1){
                                return (

                                    <div 
                                        key={index} 
                                        className="__item"
                                        style={{backgroundColor: pagination_active === index + 1 ? '#eee' : '#fff'}}
                                        onClick={() => {
                                            _read(index + 1);
                                            set_pagination_active(index + 1)
                                        }}
                                    >
                                        <div className="_position_middle">
                                            {item}
                                        </div>
                                    </div>
                                    
                                )
                            }
                        })
                    }
                </div>
            </div> */}

            <div style={{height: 100}}></div>

        </>
    );

}

export default Screen;