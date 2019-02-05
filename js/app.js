function getData(url) {
		
	let xhr = new XMLHttpRequest();

		xhr.open('GET', url, true);

		let p = new Promise(function(resolve, reject){

			xhr.onload = function(){
				if(xhr.status === 200) {
				   	let resp = JSON.parse(xhr.response);
				   	resolve(resp.Dataobject);
				} else {
				   	reject(new Error("Wystąpił Błąd"));
			    }
			};

			xhr.onerror = function(){
				reject(new Error("Wystąpił Błąd"));
			};

		});

		xhr.send();

		return p;

}

function dataAgregatr () {

	Promise.all([

		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=2"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=3"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=4"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=5"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=6"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=7"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=8"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=9"),
		getData("https://api-v3.mojepanstwo.pl/dane/poslowie.json?conditions%5Bposlowie.kadencja%5D=8&_type=objects&page=10")

	])
	.then((res) => {
			getDataPoslowie(res);
		})
	.catch(err => console.log(err));

}


function getDataPoslowie(poslowieAll) {
	let resFlattened = [].concat(...poslowieAll);
	showMeMoney(resFlattened);
}




function showMeMoney (resp) {

	let salaryies = [];

	for (let i = 0; i < resp.length; i++){
			salaryies.push(resp[i].data["poslowie.wartosc_wyjazdow8"]);
	}

	let filtered = salaryies.filter(function (el) {
			  return el != null;
	});

	let sorted = filtered.sort((a,b)=>{
		return b - a;
	});

	let top10deputObj = [];
	
	let top10deputs = sorted.filter((elem) =>{

		for (let i = 0; i < resp.length; i++){

			if (elem === resp[i].data["poslowie.wartosc_wyjazdow8"]){
				top10deputObj.push(resp[i].data);
			}

		}

	});

	showWasteful(top10deputObj);
}

function showWasteful (deputs){

	let data = [...new Set(deputs)],
		loader = document.querySelector("#loader"),
 		rootDiv = document.querySelector('#root'),
		dataNamesSal = '';

	for (let i = 0; i < data.length; i++){

		dataNamesSal += `<li>${data[i]["poslowie.nazwa"]} | 
			<strong>Wartość wyjazdów zagranicznych:</strong> ${data[i]["poslowie.wartosc_wyjazdow8"]} zł |
			<strong>Zawód:</strong> ${data[i]["poslowie.zawod"]} |
			<strong>Klub:</strong> ${data[i]["sejm_kluby.nazwa"]} |
			<strong>Frekwencja:</strong> ${data[i]["poslowie.frekwencja"]} % |
			<strong>Miejsce urodzenia:</strong> ${data[i]["poslowie.miejsce_urodzenia"]} |
			<strong>Okręg:</strong> ${data[i]["poslowie.okreg_wyborczy_numer"]}
			</li>`
	}

	loader.style.display = 'none';

	rootDiv.innerHTML = dataNamesSal;
}


dataAgregatr();