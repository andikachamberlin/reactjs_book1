const HANDLE = 'false';

function random_character(length) {

	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;

}

function random_integer(length) {

	let result = '';
	let characters = '0123456789';
	let charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;

}

function convertToRupiah(number) {

    if (number) {

        var rupiah = "";

        var numberrev = number

            .toString()

            .split("")

            .reverse()

            .join("");

        for (var i = 0; i < numberrev.length; i++)

            if (i % 3 === 0) rupiah += numberrev.substr(i, 3) + ".";

        return (

            "Rp. " +

            rupiah

                .split("", rupiah.length - 1)

                .reverse()

                .join("")

        );

    } else {

        return number;

    }

}

const getExtention = (value) => {
    return (/[.]/.exec(value)) ? 
        /[^.]+$/.exec(value) 
        :
        undefined;
}

const remove_underscore = (value) => {
    return value.replace(/_/g, " ")
}


const convertDateDBtoIndo = (string) => {
	let bulanIndo = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September' , 'Oktober', 'November', 'Desember'];
 
    let tanggal = string.split("-")[2];
    let bulan = string.split("-")[1];
    let tahun = string.split("-")[0];
 
    return tanggal + " " + bulanIndo[Math.abs(bulan)] + " " + tahun;
}

const countDown = (num, cb) => {

    let timer = num * 10000;

    let intervalId = setInterval(function(){

        if(timer !== 0){

            num--;
            
            timer -= 10000;
            
            cb(num, intervalId);
        
        } else if(timer === 0){
            
            console.log("Count Down Finish");
            
            clearInterval(intervalId);
        }

    }, 1000);

    return cb

}

let now     = new Date(); 

let HOUR    = now.getHours();
let MINUTE  = now.getMinutes();
let SECONDS = now.getSeconds();

let date = new Date();

let YEAR = date.getFullYear();
let MONTH = date.getMonth() + 1;
let TODAY = date.getDate();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function console_dev(desc, run) {
    return HANDLE === 'false' ? console.log(`${desc} : `, run) : null
}

module.exports = {
    random_character,
    random_integer,
    convertToRupiah,
    getExtention,
    convertDateDBtoIndo,
    countDown,
    remove_underscore,
    YEAR,
    MONTH,
    TODAY,
    HOUR,
    MINUTE,
    SECONDS,
    capitalizeFirstLetter,
    console_dev
};