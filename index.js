const menuItems = document.querySelectorAll('nav > .menu > a');
const cover = document.querySelector('.cover');
const launchContainer = document.getElementById('launches');
const searchbox = document.getElementById('search');

const isLogoAvailable = (abbr) => {return abbr == 'spx' || abbr == 'isro' || abbr == 'rl' || abbr == 'asa' || abbr == 'ula';}
const isBgAvailable = (shortname) => {
    return shortname == 'falcon9block5' || shortname == 'electron' || shortname == 'deltaivheavy' || shortname == 'pslv' || shortname == 'vega' || shortname == 'falconheavy'
    || shortname == 'gslvmkiii' || shortname == 'ariane5eca';
}
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

let lsp = [];
var launches = [];

function isMobile(){
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function coverLoaded(){
    cover.classList.add('loaded');
}

let hdImage = new Image();
hdImage.src = 'assets/cover.jpg';
hdImage.addEventListener('load',coverLoaded,false)

async function getAgencies(offset=0){
    let data = await fetch(`https://launchlibrary.net/1.4/lsp?offset=${offset}`);
    return (await data.json()).agencies;
}

async function getNextLaunches(){
    let data = await fetch('https://launchlibrary.net/1.4/launch?next=50&mode=verbose');
    return await data.json();
}

function prettifyDate(date,tbd=null){
    let newDate = new Date(date);
    let month = months[newDate.getMonth()];
    let day = newDate.getDate();
    let year = newDate.getFullYear();
    let prettyDate = (tbd.tbddate==1)?`TBD (Expected : ${day} ${month}, ${year})`:`${day} ${month}, ${year}`;
    let timezone = "("+Intl.DateTimeFormat().resolvedOptions().timeZone+")";
    let time = (tbd.tbdtime == 1)?'':' - '+newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })+' '+timezone;
    return prettyDate+time;
}

function getLogo(lsp){
    let abbr = lsp.abbrev.toLowerCase();
    if(isLogoAvailable(abbr)){
        return `<img class="w3-display-topleft" style="background-color:#fff;padding:5px;" width=100 src="assets/logos/${abbr}.png">`
    }else{
        return `<div class="w3-display-topleft launch-logo-alt" style="background-color:#fff;padding:5px">${(lsp.name.length > 17)?`<small>${lsp.name}</small>`:lsp.name}</div>`;
    }
}

function getRocketBg(rocket){
    let shortName = rocket.name.replace(/ /g,'').toLowerCase();
    console.log(shortName);
    if(isBgAvailable(shortName)){
        // console.log(shortName);
        return `assets/rockets/${shortName}.jpg`;
    }else if(rocket.imageURL.includes('placeholder')){
        return 'assets/cover.jpg';
    }
    // console.log(rocket.imageURL);
    return rocket.imageURL;
}
function getRocketBgPosition(rocketname){
    let trimmedName = rocketname.replace(/ /g,'').toLowerCase();
    if(trimmedName == 'electron'){
        return 'top right'
    }else if(trimmedName == 'pslv' || trimmedName == 'gslvmkiii' || trimmedName == 'ariane5eca'){
        return 'center';
    }else if(trimmedName == 'falconheavy'){
        return 'center left';
    }

    return 'top center';
}

function createLaunchCard(info){
    launchContainer.innerHTML = '';
    for(let i in info){
        let eventName = encodeURI(info[i].name + ' Launch!');
        let launchDate = new Date(info[i].net).toISOString();
        let beforeLauchDate = new Date(info[i].net);
        beforeLauchDate.setHours(beforeLauchDate.getHours()-2);
        let isoBeforeLaunch = beforeLauchDate.toISOString();
        let eventDate =
            isoBeforeLaunch.slice(0,10).replace(/-/g,'') + isoBeforeLaunch.slice(isoBeforeLaunch.indexOf('T'),isoBeforeLaunch.indexOf('.')).replace(/:/g,'') +'Z/'+
            launchDate.slice(0,10).replace(/-/g,'') + launchDate.slice(launchDate.indexOf('T'),launchDate.indexOf('.')).replace(/:/g,'')+'Z';

        let location = encodeURI((info[i].vidURLs[0])?info[i].vidURLs:info[i].location.name);
        let sprop = encodeURI('https://nextlaunch.ml');
        let googleCalendarUrl = `https://www.google.com/calendar/event?action=TEMPLATE&text=${eventName}&dates=${eventDate}&location=${location}&sprop=${sprop}`;

        launchContainer.innerHTML += 
        `
        <div class="launch">
            <span class="launch-name white-text">${info[i].name}</span><br>
            ${(info[i].vidURLs[0])?`<div class="show-mobile launch-live-link"><a target="_blank" href="${info[i].vidURLs[0]}">${info[i].vidURLs[0].split('//')[1]}</a></div>`:''}
            <div class="launch-container w3-card-4 w3-display-container" ${(i<25 || getRocketBg(info[i].rocket).includes('assets/rockets'))?`style="background:url('${getRocketBg(info[i].rocket)}');background-size:cover;background-position:${getRocketBgPosition(info[i].rocket.name)};"`:''}>
                <div class="overlay" style="opacity:.5;"></div>
                ${getLogo(info[i].lsp)}
                <div class="w3-display-middle white-text w3-large launch-date">
                    ${prettifyDate(info[i].net,{tbdtime:info[i].tbdtime,tbddate:info[i].tbddate})}
                    <br><small> ${(i==0)?'4 DAYS 2 HOUR 23 MINUTES 12 SECONDS':''}</small>
                </div>
                <div class="w3-display-bottomleft launch-buttons-container"><a target="_blank" href="${googleCalendarUrl}" class="btn1">Add to Calender</a> <a href="#" class="btn1">About Mission</a></div>
                ${(info[i].vidURLs[0])?`<div class="w3-display-topright hide-mobile launch-live-link"><a target="_blank" href="${info[i].vidURLs[0]}">${info[i].vidURLs[0].split('//')[1]}</a></div>`:''}
            </div>
        </div>

        `
    }
}
// var text = encodeURIComponent('Housters To-Do Due: ' + self.task());
// var startDate = moment(self.dueDate()).format('YYYYMMDD');
//     var endDate = moment(self.dueDate()).add('days', 1).format('YYYYMMDD');
//     var details = encodeURIComponent(self.task());
//     var location = encodeURIComponent(self.propertyName());
//     var googleCalendarUrl = 'http://www.google.com/calendar/event?action=TEMPLATE&text=' + text + '&dates=' + startDate + '/' + endDate + '&details=' + details + '&location=' + location;
function searchUpdateHandler(){
    if(searchbox.value.length < 2) createLaunchCard(launches);
    let val = searchbox.value.toLowerCase().replace(/ /g,'');
    let val2 = searchbox.value.toLowerCase();
    let result = launches.filter(launch=>{
        return launch.name.toLowerCase().includes(val) || launch.lsp.name.toLowerCase().includes(val) || launch.lsp.abbrev.toLowerCase().includes(val) || launch.rocket.name.toLowerCase().includes(val) || launch.name.toLowerCase().includes(val2) || launch.lsp.name.toLowerCase().includes(val2) || launch.lsp.abbrev.toLowerCase().includes(val2) || launch.rocket.name.toLowerCase().includes(val2)
    });
    createLaunchCard(result);
}

getAgencies(0)
    .then((data)=>{
        lsp.push(...data);
        return 30;
    })
    .then(getAgencies)
    .then((data)=>{
        lsp.push(...data);
    })

getNextLaunches()
    .then((data)=>{
        launches = data.launches;
        console.log(launches);
        createLaunchCard(launches);
    });




searchbox.addEventListener('keyup',searchUpdateHandler);

// A well written code that turned out to be useless since I found easier way of doing it but since I spent lot of time on this code so dont want to just delete it  :'( 
// so here's to a useless peice of art(shit)
 // let lspids = Array.from(new Set(launches.map(launch=>{return launch.lsp})));
        // for(let id of lspids){
        //     lsp[id] = await (await fetch(`https://launchlibrary.net/1.4/agency/${id}`)).json();
        // }
        // console.log(lsp);
