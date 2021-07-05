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
import { API_GET_REQUEST, API_SERVER, API_SCT } from '../../api';
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
import { random_character } from '../../functions'
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

                <meta name="description" content={'Test'}/>
                <title>{'Test'}</title>

            </Helmet>

            <h1>Test</h1>

        </>
    );

}

export default Screen;