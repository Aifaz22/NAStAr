/*
* Author: Aifaz Dhuka
* Project: NAStAr => single page app that interacts with NASA's API and also uses hashmap.
*/
const APOD_url= 'https://api.nasa.gov/planetary/apod?api_key='
const api_key= config.ApiKey_NASA
const startDate='&start_date='
const endDate='&end_date='


//today's date formatting
var date=new Date();
date=date.toISOString().slice(0,10);


// required global variables
var currentDataIndex=0;
var dataArray=[];
// hashmap for storing session data for quick access (caching)
const dataMap = new Map();


// initialize elements when loaded
// base page: APOD (with current day's Data)
document.addEventListener("DOMContentLoaded", function() {
        
    data=searchSessionData();
    
    document.getElementById('start-date').value=date;
    document.getElementById('start-date').max=date;
    document.getElementById('end-date').value=date;
    document.getElementById('end-date').max=date;
    document.getElementById('end-date').min=document.getElementById('start-date').value;    
});

// sidebar content display
const show = function(index){
    const cont1=document.getElementById("container");
    const cont2=document.getElementById("container2");
    const pageheader=document.querySelector("h1");
    const form = document.getElementById("form-content");
    if (index==1){ //show APOD
        cont1.style.display="flex";
        form.style.display="block";
        cont2.style.display="none";
        pageheader.innerText="Nasa's Astronomic picture of the da[y](te)";
    } else { //show asteroid search
        cont1.style.display="none";
        cont2.style.display="block";
        form.style.display="none"
        pageheader.innerText="About NAStAr";
    }
    toggleSidebar();
}
function toggleSidebar(){
    //toggle the sidebar
    const sidebar=document.getElementById('sidebar');
    
    if (sidebar.className=='invisible') {
        sidebar.className='visible';
    } else {
        sidebar.className='invisible';
    }    
}

// displays the contents fetched according to the type of the media
const display = (data)=>{
    console.log('displaying...');
    var img=document.getElementById('Image');
    var vid=document.getElementById('Video');
    var des=document.getElementById('Details');
    

    //if data is Array, then choose the first one and display that and store the data in an array
    if (data instanceof Array){
        dataArray=data;
        data=data[0];
    }
    //display image or iframe based on the media type
    if (data.media_type=="image"){
        
        vid.style.display='none';
        img.style.display='block';
        img.src=data.hdurl;
        des.innerHTML=`<h2>${data.title}</h2><p style="font-size:18px;">${data.explanation}</p>`;
        //check for slideshow arrow requirement
        slideshowArrowDisplay(img.height);
    }else if (data.media_type=="video"){
        vid.style.display='block';
        vid.width=window.innerWidth*0.5;
        vid.height=window.innerHeight*0.5;
        img.style.display='none';
        vid.src=data.url;
        //check for slideshow arrow requirement
        slideshowArrowDisplay(vid.height);
        des.innerHTML=`<h2>${data.title}</h2><p style="font-size:18px;">${data.explanation}</p>`;

    }
    if (data.copyright!=undefined){ // add copyright if it exists
        des.innerHTML+=`<h4>Copyright: ${data.copyright}<h4>`;
    }
}

// when sidebar btn is clicked
document.getElementById('sidebar-btn').addEventListener('click',()=>{
    //toggle the sidebar
    const sidebar=document.getElementById('sidebar');
    
    if (sidebar.className=='invisible') {
        sidebar.className='visible';
    } else {
        sidebar.className='invisible';
    }    
})



// when startDate is updated
const updateSDate = function(){
    const sDateElement=document.getElementById('start-date');
    const eDateElement=document.getElementById('end-date');
    eDateElement.min=sDateElement.value;
    // check if end date is earlier that start date, if so correct it
    if (eDateElement.min>eDateElement.value){
        eDateElement.value=eDateElement.min;
    }    
}

// displays/hides end-date input based on checkbox
const secondDateDisplay=function(){
    var checkbox = document.getElementById('checkbox');
    var edate =document.getElementById('end-date');
    var sdate =document.getElementById('start-date');
    /*
        If slideshow checked then using the dates get the data
        if unchecked, 
            make the end date read only, and set the start date to the date the pic displayed during the slideshow
            also remove the arrows
    */
    if (checkbox.checked){
        edate.readOnly=false;
    }else{
        edate.readOnly=true;
        sdate.value=dataArray[currentDataIndex].date;
        document.getElementById('next').style.display='none';
        document.getElementById('prev').style.display='none';
    }
}


const slideshowArrowDisplay = (height)=>{
    /*
     * displays slideshow arrows only if there is more than 1 pic to show 
     */
    var next=document.getElementById('next');
    var prev=document.getElementById('prev');
    if (dataArray.length>1 && document.getElementById('checkbox').checked){
        next.style.display='block';        
        prev.style.display='block';
    }else{
        next.style.display='none';
        prev.style.display='none';
    }
}

// updates arrow sizes for the images based on their size
function arrowSizeChange(){
    var height = document.getElementById('Image').height;
    var next=document.getElementById('next');
    var prev=document.getElementById('prev');
    if (document.getElementById('Image').style.display=='none'){
        height = 316;
    }
    next.style.height=`${height}px`;
    prev.style.height=`${height}px`;

    // set lineheight such that arrow appear slightly above the center 
    next.style.lineHeight=`${height*0.75}px`;
    prev.style.lineHeight=`${height*0.75}px`;
}

// display the next or previous image for the slideshow
const getFollowingItemData =(i)=>{
    var img = document.getElementById("Image");
    var vid = document.getElementById("Video");
    
    if (currentDataIndex+i <0){ // handles negative index scenarios
        currentDataIndex=dataArray.length+(currentDataIndex+i);
        
    }else{ // handles positive index scenarios
        currentDataIndex= (currentDataIndex+i)%(dataArray.length);
    }

    // display new data
    if (i>0){
        img.classList.add("moveLeft");
        vid.classList.add("moveLeft");
        display(dataArray[currentDataIndex]);
        setTimeout(()=>{
            img.classList.remove("moveLeft");
            vid.classList.remove("moveLeft");
        }, 1000);
    }else{
        img.classList.add("moveRight");
        vid.classList.add("moveRight");
        display(dataArray[currentDataIndex]);
        setTimeout(()=>{
            img.classList.remove("moveRight");
            vid.classList.remove("moveRight");
        }, 1000);
    }
    document.getElementById("Details").classList.add("changeDetails");
    setTimeout(()=>{
        document.getElementById("Details").classList.remove("changeDetails");
    },1000)
    

}

// when fetch button clicked
function getData(){
    const sDateElement=document.getElementById('start-date');
    const eDateElement=document.getElementById('end-date');
    //if checkbox is checked(end-date visible) fetch multiple
    if (eDateElement.readOnly===false){
        //////////////////////////
        searchSessionData(sDateElement.value,eDateElement.value);
    }
    // else fetch the start-date img
    else {
        // console.log('date value ======='+sDateElement.value);
        searchSessionData(sDateElement.value);
    }
}

// search for data withing the map first before fetching from api
async function searchSessionData(sdate='',edate=''){
    var data;
    console.log('checking sessions data...')
    const img = document.getElementById("Image");
    const vid =document.getElementById("Video");
    const det =document.getElementById("Details");
    // get today's image
    if (sdate==''  ){
        data= await fetchData();
        img.classList.add("newDetails");
        vid.classList.add("newDetails");
        det.classList.add("newDetails");
        setTimeout(()=>{
            img.classList.remove("newDetails");
            vid.classList.remove("newDetails");
            det.classList.remove("newDetails");
        }, 1000);
    } // get that particular date (sdate)
    else if (edate==''){
        if (dataMap.get(new Date(sdate).toISOString().slice(0,10))==undefined){
            console.log('got it NOTTTTTTTT')
            data = await fetchData(sdate);
        }else{
            console.log('got it!!!!!!!!!!!!!!!!!')
            data=dataMap.get(sdate);
        }
        img.classList.add("changeDetails");
        vid.classList.add("changeDetails");
        det.classList.add("changeDetails");
        setTimeout(()=>{
            img.classList.remove("changeDetails");
            vid.classList.remove("changeDetails");
            det.classList.remove("changeDetails");
        }, 1000);
    }else{
        // get range
        var unseenDates=getUnseenDates(new Date(sdate),new Date(edate));
        for (const range of unseenDates) {
            await fetchData(range.start,range.end);
        }
        // weave all data
        data=[];
        var allDatesinrange= getAllDates(new Date(sdate), new Date(edate));
        for (const keyDate of allDatesinrange){
             data.push(dataMap.get(keyDate));
        };
        
    }
    try{
        display(data);
    }
    catch (error){
        console.log(error);
    }
    
}

// fetch data from the API and stores it to the hashmap
const fetchData = async(sdate='', edate='')=>{
    try {
        console.log('fetching...')
        var response;
        var data;

        // send requests to fetch data from api using different urls based on the function args
        document.getElementById('fetch-btn').disabled=true;
        if (sdate==='' && edate===''){ //get today
            sdate=date;
            response = await fetch(`${APOD_url}${api_key}`);
        }else if (edate===''){ // get sdate's pic of the day
            response = await fetch(`${APOD_url}${api_key}&date=${sdate}`);
        }else{ // get a all the pic of the day's from sdate to edate
            response = await fetch(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`)
            currentDataIndex=0; //set data array index to 0 for slideshow purpose.
        }
        data = await response.json();
        if (data instanceof Array){
            for (const element of data) {
                dataMap.set(new Date(element.date).toISOString().slice(0,10),element);
            };
        }else{
            dataMap.set(new Date(sdate).toISOString().slice(0,10),data);
        }
        document.getElementById('fetch-btn').disabled=false; // let user fetch new data now

        return data;
    } catch (error) {
        console.log(error)
        document.getElementById('details').innerHTML="<h1>Error fetching</h1>"
        document.getElementById('fetch-btn').disabled=false; // let user fetch new data now
        return 
    }
}


const surprise = ()=>{ // adds text to the title in about. (Easiest easter egg)
    document.getElementById("WhatDidIDoSurprise").innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp; I learnt JavaScript and this is my first project with it."
}

const surpriseOver = ()=>{
    document.getElementById("WhatDidIDoSurprise").innerHTML="What did I do?"
}

// returns an array populated with dates between the two dates
const getAllDates = (sdate,edate)=>{
    const result=[];
    var current=sdate;
    while (current<=edate){
        result.push(current.toISOString().slice(0,10));
        current=nextDay(current)
    }
    return result;
}

// next day function call that returns the next day
const nextDay = (current)=>{
    const nextDate=new Date(current);
    nextDate.setDate(nextDate.getDate()+1);
    return nextDate;
}

// gets the range of dates that are not present in the hashmap
const getUnseenDates = (sdate,edate)=>{
    const resultingDates = [];
    var rangeDates={
        'start':undefined,
        'end':undefined
    };
    var current = sdate;
    var previousDate;
    
    while (current<edate){
        // if not in hashmap, add date to the rangeDate Array
        if (dataMap.get(current.toISOString().slice(0,10))==undefined){
            if (rangeDates.start==undefined){// check if the start date of range is added
                rangeDates.start=current.toISOString().slice(0,10);
            }
            previousDate=current;
        }else{ // if it is in hashmap, push the array of dates to 
            if (rangeDates.start!=undefined){
                rangeDates.end=previousDate.toISOString().slice(0,10);
                resultingDates.push(rangeDates);
            }
            rangeDates={
                'start':undefined,
                'end':undefined
            };
        }
        current=nextDay(current);
    }
    if (rangeDates.start!=undefined){
        rangeDates.end=current.toISOString().slice(0,10);
        resultingDates.push(rangeDates);
        rangeDates={
            'start':undefined,
            'end':undefined
    };
    }
    return resultingDates;
}