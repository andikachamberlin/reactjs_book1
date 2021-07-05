/*------------------------------------------------------------------
[Module]
-------------------------------------------------------------------*/
import Promise from 'bluebird';
import axios from 'axios'
import qs from 'querystring'
import {reactLocalStorage} from 'reactjs-localstorage';

import {HANDLE_PRODUCTION} from '../handle';

let STORAGE_USER = reactLocalStorage.get('@user');
let STORAGE_GUEST_USER = reactLocalStorage.get('@guest_user');
let STORAGE_TOKEN = reactLocalStorage.get('@token');
/*------------------------------------------------------------------
[End Module]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API URL]
-------------------------------------------------------------------*/
export const API_URL = HANDLE_PRODUCTION === 'false' ? process.env.REACT_APP_API_DEVELOPMENT : process.env.REACT_APP_API_PRODUCTION;
/*------------------------------------------------------------------
[API URL]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API SERVER]
-------------------------------------------------------------------*/
export const API_SERVER = HANDLE_PRODUCTION === 'false' ? process.env.REACT_APP_API_SERVER_DEVELOPMENT : process.env.REACT_APP_API_SERVER_PRODUCTION;
export const API_SERVER_CLIENT = HANDLE_PRODUCTION === 'false' ? process.env.REACT_APP_API_SERVER_CLIENT_DEVELOPMENT : process.env.REACT_APP_API_SERVER_CLIENT_PRODUCTION;
/*------------------------------------------------------------------
[End API SERVER]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API Uploads]
-------------------------------------------------------------------*/
export const API_UPLOADS = API_SERVER + '/uploads/';
export const API_SIGNATURE = API_SERVER + '/signature/';
/*------------------------------------------------------------------
[End API Uploads]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[API Security]
-------------------------------------------------------------------*/
export const API_SCT = '9zAE9r4eGwRQSQx6JAXbKWfweS8qFyu3XfxgauNncCbsectyG642ck3du4Xeg2C5';
/*------------------------------------------------------------------
[End API Security]
-------------------------------------------------------------------*/

/*------------------------------------------------------------------
[HTTP REQUEST]
-------------------------------------------------------------------*/

export const API_GET_PUBLIC = (url) => {

    return new Promise(async (resolve, reject) => {
        try {

            axios({
                timeout: 10000,
                method: 'GET',
                url: API_URL + url,
            }).then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error);
                console.log(error);
            });

        } catch (error) {
            reject(error);
            console.log('API Error Try Catch :', error); 
        }
        
    });

}

export const API_GET_URL = (url) => {

    return new Promise(async (resolve, reject) => {
        try {

            axios({
                timeout: 10000,
                method: 'GET',
                url: url,
            }).then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error);
                console.log(error);
            });

        } catch (error) {
            reject(error);
            console.log('API Error Try Catch :', error); 
        }
        
    });

}

export const API_GET_REQUEST = (url) => {

    if(STORAGE_USER !== undefined){

        let key_parse = JSON.parse(STORAGE_USER)

        return new Promise(async (resolve, reject) => {
    
            try {
                
                axios({
                    timeout: 10000,
                    method: 'GET',
                    url: 
                        API_URL 
                        + url 
                        + '&sct=' + API_SCT 
                        + '&key=' + key_parse[0].id_key,
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": "Bearer " + STORAGE_TOKEN,
                    },
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
        
            } catch (error) {
                reject(error);
                console.log('API Error Try Catch :', error);
            }
            
        });
    
    }

}

export const API_COMMENT = (url) => {

    if(STORAGE_GUEST_USER !== undefined){

        let key_parse = JSON.parse(STORAGE_GUEST_USER)

        return new Promise(async (resolve, reject) => {
    
            try {
                
                axios({
                    timeout: 10000,
                    method: 'GET',
                    url: 
                        API_URL 
                        + url 
                        + '&sct=' + API_SCT 
                        + '&key=' + key_parse[0].id_key,
                    headers: {
                        'Accept': 'application/json',
                        "Authorization": "Bearer " + STORAGE_TOKEN,
                    },
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
        
            } catch (error) {
                reject(error);
                console.log('API Error Try Catch :', error);
            }
            
        });
    
    }

}

export const API_LOGIN = (url, body) => {

    return new Promise(async (resolve, reject) => {

        try {
            
            axios({
                timeout: 10000,
                method: 'POST',
                url: API_URL + url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                data: qs.stringify(body)
            }).then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error);
                console.log(error);
            });
    
        } catch (error) {
            reject(error);
            console.log('API Error Try Catch :', error);
        }
        
    });

}

export const API_REGISTER = (url, body) => {

    return new Promise(async (resolve, reject) => {

        try {
            
            axios({
                timeout: 10000,
                method: 'POST',
                url: API_URL + url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                data: qs.stringify(body)
            }).then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error);
                console.log(error);
            });
    
        } catch (error) {
            reject(error);
            console.log('API Error Try Catch :', error);
        }
        
    });

}

export const API_POST = (url, body) => {

    if(STORAGE_USER !== undefined){

        let key_parse = JSON.parse(STORAGE_USER)

        let form_data = {
            sct: API_SCT, 
            key: key_parse[0].id_key
        };

        form_data = {...form_data, ...body};

        if(form_data){

            return new Promise(async (resolve, reject) => {
        
                try {
                    
                    axios({
                        timeout: 10000,
                        method: 'POST',
                        url: API_URL + url,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            "Authorization": "Bearer " + STORAGE_TOKEN,
                        },
                        data: qs.stringify(form_data)
                    }).then((response) => {
                        resolve(response)
                    }).catch((error) => {
                        reject(error);
                        console.log(error);
                    });
            
                } catch (error) {
                    reject(error);
                    console.log('API Error Try Catch :', error);
                }
                
            });

        }


    
    }

}

export const API_LOGOUT = (url) => {

    let key_parse = JSON.parse(STORAGE_USER)

    let body;

    if(key_parse){
        
        body = {
            sct : API_SCT,
            key : key_parse[0].id_key
        }
        
    }

    if(body){

        return new Promise(async (resolve, reject) => {
    
            try {
                
                axios({
                    timeout: 10000,
                    method: 'POST', 
                    url: API_URL + url,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        "Authorization": "Bearer " + STORAGE_TOKEN,
                    },
                    data: qs.stringify(body)
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
        
            } catch (error) {
                reject(error);
                console.log('API Error Try Catch :', error);
            }
            
        });

    }
    
}

export const API_LOGOUT_GUEST = (url) => {

    let key_parse = JSON.parse(STORAGE_GUEST_USER)

    let body;

    if(key_parse){
        
        body = {
            sct : API_SCT,
            key : key_parse[0].id_key
        }
        
    }

    if(body){

        return new Promise(async (resolve, reject) => {
    
            try {
                
                axios({
                    timeout: 10000,
                    method: 'POST', 
                    url: API_URL + url,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        "Authorization": "Bearer " + STORAGE_TOKEN,
                    },
                    data: qs.stringify(body)
                }).then((response) => {
                    resolve(response)
                }).catch((error) => {
                    reject(error);
                    console.log(error);
                });
        
            } catch (error) {
                reject(error);
                console.log('API Error Try Catch :', error);
            }
            
        });

    }
    
}

/*------------------------------------------------------------------
[End HTTP Request]
-------------------------------------------------------------------*/