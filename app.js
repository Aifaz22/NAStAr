const APOD_url= 'https://api.nasa.gov/planetary/apod?api_key='
const api_key= config.ApiKey_NASA
const startDate='&start_date='
const endDate='&end_date='

//today's date formatting
var today=new Date();
var yr= (today.getFullYear()).toString();
var month=today.getMonth()+1;
var date=today.getDate();
if (month<10){
    var mon='0'+month;
}else{
    var mon=month.toString();
}
if (date<10){
    var day='0'+date;
}else{
    var day=date.toString();
}
//date formatted as yyyy-mm-dd
var date = yr+'-'+mon+'-'+day;



/*const fetchData = async()=>{
    try {
        const response = await fetch(`${APOD_url}${api_key}`)
        const data = await response.json()
        console.log(data)
        display(data)
    } catch (error) {
        console.log(error)
        return 
    }
}
const fetchDateData = async(sdate)=>{
    try {
        const response = await fetch(`${APOD_url}${api_key}&date=${sdate}`)
        const data = await response.json()
        console.log(data)
        display(data)
    } catch (error) {
        console.log(error)
        return 
    }
}
const fetchRangeData = async(sdate, edate)=>{
    try {
        const response = await fetch(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`)
        const data = await response.json()
        console.log(data);
        // slideshowDisplay(data);
        data.forEach(element => {
            display(element)
        });
        
    } catch (error) {
        console.log(error)
        return 
    }
}*/
// initialize elements when loaded
document.addEventListener("DOMContentLoaded", function() {
        
    data=fetchData();
    
    document.getElementById('start-date').value=date;
    document.getElementById('start-date').max=date;
    document.getElementById('end-date').value=date;
    document.getElementById('end-date').max=date;
    document.getElementById('end-date').min=document.getElementById('start-date').value;    
});

// fetch data from the API
const fetchData = async(sdate='', edate='')=>{
    try {
        var response;
        if (sdate==='' && edate===''){
            console.log(`${APOD_url}${api_key}`);
            response = await fetch(`${APOD_url}${api_key}`)
        }else if (edate===''){
            console.log(`${APOD_url}${api_key}&date=${sdate}`);
            response = await fetch(`${APOD_url}${api_key}&date=${sdate}`)
        }else{
            console.log(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`);

            response = await fetch(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`)
        }
        
        const data = await response.json()
        console.log(data)
        display(data)
    } catch (error) {
        console.log(error)
        return 
    }
}
// init function for the pages
const show = function(a){
    const cont1=document.getElementById("container");
    const cont2=document.getElementById("container2");
    const pageheader=document.querySelector("h1");
    if (a==1){
        cont1.style.display="block";
        cont2.style.display="none";
        pageheader.innerText="Nasa's Astronomic picture of the da[y](te)";
    } else {
        cont1.style.display="none";
        cont2.style.display="block";
        pageheader.innerText="Asteroid search";

    }
}

// displays the contents fetched according to the type of the media
const display = (data)=>{
    var img=document.getElementById('Image');
    var vid=document.getElementById('Video');
    var des=document.getElementById('Details')
    if (data.media_type=="image"){
        vid.style.display='none';
        img.style.display='block';
        img.src=data.hdurl;
        des.innerHTML=`<h3>${data.title}<h3>${data.explanation}`;
    }else if (data.media_type=="video"){
        vid.style.display='block';
        img.style.display='none';
        vid.src=data.url;
    }
}

// when sidebar btn is clicked
document.getElementById('sidebar-btn').addEventListener('click',()=>{
    // show sidebar
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
    //if checkbox is checked(end-date visible) fetch multiple
    if (eDateElement.readOnly===false){
        fetchData(sDateElement.value,eDateElement.value);
    }
    // else fetch the start-date img
    else {
        console.log('date value ======='+sDateElement.value);
        fetchData(sDateElement.value);
    }
    
}

// when end date is updated
const updateEDate= ()=>{
    // fetch multiple images
    const sDateElement=document.getElementById('start-date');
    const eDateElement=document.getElementById('end-date');
    fetchData(sDateElement.value,eDateElement.value);
}

// adds the image to the screen
const createImageElement= function(){
    // add image
    var img = document.createElement('img');
    img.id='Image';
    img.style.width='48%';
    img.style.marginLeft='auto';
    img.style.marginRight='auto';
    img.style.display='none';  
    img.src='#';
    // append to content div
    document.getElementById('container').appendChild(img);
}

const createVideoElement= ()=>{
    // add video
    var vid = document.createElement('iframe');
    vid.id='Video';
    vid.width="630";
    vid.height="472.5";
    vid.style.marginLeft='auto';
    vid.style.marginRight='auto';
    vid.style.display='none';  
    vid.src='#';
    // append to content div
    document.getElementById('container').appendChild(vid);

}


// displays/hides end-date input based on checkbox
const secondDateDisplay=function(){
    var checkbox = document.getElementById('checkbox');
    if (checkbox.checked){
        document.getElementById('end-date').readOnly=false;
    }else{
        document.getElementById('end-date').readOnly=true;//style.visibility="collapse"; 
    }
}
