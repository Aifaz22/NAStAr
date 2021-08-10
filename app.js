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

// required global variables
var currentDataIndex=0;
var dataArray=[];

// initialize elements when loaded
// base page: APOD (with current day's Data)
document.addEventListener("DOMContentLoaded", function() {
        
    data=fetchData();
    
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
    if (index==1){ //show APOD
        cont1.style.display="block";
        cont2.style.display="none";
        pageheader.innerText="Nasa's Astronomic picture of the da[y](te)";
    } else { //show asteroid search
        cont1.style.display="none";
        cont2.style.display="block";
        pageheader.innerText="Asteroid search";

    }
}

// fetch data from the API
const fetchData = async(sdate='', edate='')=>{
    try {
        var response;
        // send requests to fetch data from api using different urls
        if (sdate==='' && edate===''){
            console.log(`${APOD_url}${api_key}`);
            response = await fetch(`${APOD_url}${api_key}`)
        }else if (edate===''){
            console.log(`${APOD_url}${api_key}&date=${sdate}`);
            response = await fetch(`${APOD_url}${api_key}&date=${sdate}`)
        }else{
            console.log(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`);

            response = await fetch(`${APOD_url}${api_key}${startDate}${sdate}${endDate}${edate}`)
            currentDataIndex=0;
        }
        
        const data = await response.json()
        console.log(data);
        // display the data
        display(data);
        // check if there is a need to display arrows
        slideshowArrowDisplay();
    } catch (error) {
        console.log(error)
        return 
    }
}


// displays the contents fetched according to the type of the media
const display = (data)=>{
    var img=document.getElementById('Image');
    var vid=document.getElementById('Video');
    var des=document.getElementById('Details');
    //check for slideshow arrow requirement
    slideshowArrowDisplay();

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
        des.innerHTML=`<h3>${data.title}<h3>${data.explanation}`;
    }else if (data.media_type=="video"){
        vid.style.display='block';
        vid.width=window.innerWidth*0.5;
        vid.height=window.innerHeight*0.5;
        img.style.display='none';
        vid.src=data.url;
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
        fetchData(sdate.value,edate.value);
    }else{
        edate.readOnly=true;
        sdate.value=dataArray[currentDataIndex].date;
        document.getElementById('next').style.display='none';
        document.getElementById('prev').style.display='none';
    }
}


const slideshowArrowDisplay = ()=>{
    /*
     * displays slideshow arrows only if there is more than 1 pic to show 
     */
    if (dataArray.length>1){
        document.getElementById('next').style.display='block';
        document.getElementById('prev').style.display='block';
    }else{
        document.getElementById('next').style.display='none';
        document.getElementById('prev').style.display='none';
    }
}

const getFollowingItemData =(i)=>{
    
    if (currentDataIndex+i <0){ // handles negative index scenarios
        currentDataIndex=dataArray.length+(currentDataIndex+i);
    }else{ // handles positive index scenarios
        currentDataIndex= (currentDataIndex+i)%(dataArray.length);
    }

    // display new data
    display(dataArray[currentDataIndex]);

}