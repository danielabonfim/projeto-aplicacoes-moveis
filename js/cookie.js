const FC_BTN = "#fortune_cookie";
let currentFortune;

class FortuneList {
  constructor(fortuneList) {
    this.fortuneList = fortuneList;
  }

  toJson() {
    const lis = [];
    this.fortuneList.forEach(fortune => lis.push(fortune.toJson()))
  }
}

class Fortune {
  constructor(id, text, timestamp) {
    this.id = id;
    this.text = text;
    this.timestamp = timestamp
  }

  toJson() {
    return {
      "id": this.id,
      "text": this.text,
      "timestamp": this.timestamp
    }
  }
}

class LocalStorage{
  constructor(){
    this.fortuneList = "fortuneList";
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

function renderList(localStorage){
  const fortuneList = localStorage.getFortuneList();

  fortuneList.forEach(fortune =>{
    $("#fortune_list").append(
      `
      <li class="list-group-item d-flex justify-content-between align-items-start">
      <div class="ms-2 me-auto">
        <div class="fw-bold">${fortune.timestamp}</div>
        ${fortune.text}
      </div>
      <span id="delete_${fortune.timestamp}" class="badge bg-primary rounded-pill">14</span>
    </li>
    `
    )
  })
}

addEventListener("load",app);

function app() {
  const lc = new LocalStorage();

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

  $("#save_fortune").on("click", ()=> lc.addFortuneToList(currentFortune))
  $("#saved_list").on("click", ()=>{
    renderList(lc);
    $("#fortune_list").removeClass("d-none");
    $("#fortune_cookie").addClass("d-none");
    
  })


}