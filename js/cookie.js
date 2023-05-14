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
  constructor(id, text) {
    this.id = id;
    this.text = text;
  }

  toJson() {
    return {
      "id": this.id,
      "text": this.text
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
    return  new Fortune(response.data.slip.id, response.data.slip.advice,);
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
  $(FC_BTN).on("click", ()=>{
    nextState();
  })
}