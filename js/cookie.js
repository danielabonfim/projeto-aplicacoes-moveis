const FC_BTN = "#fortune_cookie";

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
    const fortuneList = [];
    let localStorageList = localStorage.getItem(this.fortuneList)?? [];
    localStorageList = JSON.parse(fortuneList);

    localStorageList.array.forEach(fortune => {
      new Fortune(
        fortune.id,
        fortune.text,
        fortune.timestamp
      )
    });

    return fortuneList;

  }

  addFortuneList(fortune){
    let fortuneList = localStorage.getItem(this.fortuneList) ?? [];
    fortuneList = JSON.parse(fortuneList);
    
    fortuneList.push(fortune.toJson);

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
    return  new Fortune(response.data.slip.id, response.data.slip.advice, new Date());
  }catch(e){
    console.log(e);
  };

}

async function nextState(){
  const spawned = "spawned";
  const opened = "opened";

  // open cookie
  if ($(FC_BTN).hasClass(spawned)) {
    const fortune = await getFortune();
    $(".fc-fortune-text").html(fortune.text);


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


addEventListener("load",app);

function app() {
  const lc = new LocalStorage();


  $(".btn-secondary").on("mouseenter", () => $(".btn-icon-secondary").addClass("stroke-seconday")).on("mouseleave", ()=> $(".btn-icon-secondary").removeClass("stroke-seconday"));
  $(FC_BTN).on("click", ()=>{
    nextState();
  })
}