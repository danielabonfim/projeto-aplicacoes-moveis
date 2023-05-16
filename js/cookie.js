const FC_BTN = "#fortune_cookie";
let currentFortune;

class FortuneListService {

  constructor(
    fortuneList 
  ){
    this.fortuneList = "fortuneList";
  }

  toJson() {
    const lis = [];
    this.fortuneList.forEach(fortune => lis.push(fortune.toJson()))
  }

  removeFortune(timestamp){
    const localStorageList = localStorage.getItem(this.fortuneList)
    let fortuneList = localStorageList ? JSON.parse(localStorageList) : [];

    if(fortuneList.length !== 1){
      const index = fortuneList.findIndex((fortune) => {
        console.log(fortune.timestamp)
        console.log(typeof fortune.timestamp)
  
        console.log(timestamp)
        console.log(typeof timestamp)
  
        return fortune.timestamp == timestamp
      });
  
      fortuneList = fortuneList.splice(index, 1);
    }else{
      fortuneList = [];
    }
   
    localStorage.setItem(this.fortuneList, JSON.stringify(fortuneList));
  }

  getFortuneList(){
    const localStorageList = localStorage.getItem(this.fortuneList);
    const fortuneList = localStorageList ? JSON.parse(localStorageList) : [];

    fortuneList.forEach(fortune => {
      new Fortune(
        fortune.id,
        fortune.text,
        fortune.timestamp
      )
    });

    return fortuneList;

  }

  addFortuneToList(fortune){
    const localStorageList = localStorage.getItem(this.fortuneList)
    const fortuneList = localStorageList ? JSON.parse(localStorageList) : [];
    fortuneList.push(fortune.toJson());
    localStorage.setItem(this.fortuneList, JSON.stringify(fortuneList));
  }
}

class Fortune {
  constructor(id, text, timestamp) {
    this.id = id;
    this.text = text;
    this.timestamp = timestamp.toString()
  }

  toJson() {
    return {
      "id": this.id,
      "text": this.text,
      "timestamp": this.timestamp
    }
  }
}

async function getFortune(){
  try{
    let response = await axios({
      method: "get",
      url: "https://api.adviceslip.com/advice",
      }
    );
    console.log(response)
    return  new Fortune(response.data.slip.id, response.data.slip.advice, Date.now());
  }catch(e){
    console.log(e);
  };

}

async function nextState(){
  const spawned = "spawned";
  const opened = "opened";

  // open cookie
  if ($(FC_BTN).hasClass(spawned)) {
    currentFortune = await getFortune();
    $(".fc-fortune-text").html(currentFortune.text);

    $("#save_fortune").removeClass("disabled");
    
    $(FC_BTN).removeClass(spawned);
    $('.fc-fortune').removeClass('d-none')
    $(FC_BTN).addClass(opened);


  // new cookie
  } else {
    $(FC_BTN).removeClass(opened);
     $('.fc-fortune').addClass('d-none')
    $(FC_BTN).addClass(spawned);
  }
};

function renderList(fortuneListService){
  const fortuneList = fortuneListService.getFortuneList();
  let html = ""
  if(fortuneList && !fortuneList.length){
    html = `
    <li id="no_fortune_msg"class="list-group-item d-flex justify-content-between align-items-start">
    <div class="ms-2 me-auto">
      Você não tem sortes salvas :(
    </div>
    </li>
    `
  }else{
    fortuneList.forEach(fortune =>{
      html +=
        `
        <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">${fortune.timestamp}</div>
          ${fortune.text}
        </div>
        <img value="${fortune.timestamp}" class="delete btn-icon-secondary cursor-icon" src = "trash-can.svg"/>
       
      </li>
      `
    })
  }

  $("#fortune_list").html(html);

  $(".delete").on("click", (e)=> {
    const timeStamp = $(e.target).attr("value");
    fortuneListService.removeFortune(timeStamp);
    renderList(fortuneListService);
  })
}


addEventListener("load",app);

function app() {
  const fortuneListService = new FortuneListService();

  $(".btn-secondary").on(
    "mouseenter",
    () => $(".btn-icon-secondary").addClass("stroke-seconday"))
    .on(
      "mouseleave",
      ()=> $(".btn-icon-secondary").removeClass("stroke-seconday")
    );

  $(FC_BTN).on("click", ()=>{
    nextState();
  })

  function toggleCookieAndList(){
    if( $("#fortune_list").hasClass("d-none")){
      $("#fortune_list").removeClass("d-none");
      $("#fortune_cookie").addClass("d-none");
      
      $("#save_fortune").addClass("d-none");
      $("#back_to_cookie").removeClass("d-none");
    }else{
      $("#fortune_list").addClass("d-none");
      $("#fortune_cookie").removeClass("d-none");
      
      $("#save_fortune").removeClass("d-none");
      $("#back_to_cookie").addClass("d-none");
    }
  }

  $("#save_fortune").on("click", ()=> fortuneListService.addFortuneToList(currentFortune))
  $("#saved_list").on("click", ()=>{
    $("#saved_list").addClass("selected");
    renderList(fortuneListService);
    
    toggleCookieAndList();

    $("#back_to_cookie").off();
    $("#back_to_cookie").on("click", toggleCookieAndList);
  })
}