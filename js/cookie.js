const FC_BTN = "#fortune_cookie";

async function getFortune(){
  try{
    let response = await axios({
      method: "get",
      url: "https://api.adviceslip.com/advice",
      }
    );

    return response.data;

  }catch(e){
    console.log(e);
  };

}

function nextState(){
  const spawned = "spawned";
  const opened = "opened";

  // open cookie
  if ($(FC_BTN).hasClass(spawned)) {
    $(FC_BTN).removeClass(spawned);
            $('.fc-fortune').removeClass('d-none')
    $(FC_BTN).addClass(opened);

  // new cookie
  } else {
    $(FC_BTN).removeClass(opened);
     $('.fc-fortune').addClass('d-none')
    $(FC_BTN).addClass(spawned);

    getFortune();
  }
};


addEventListener("load",app);
function app() {
  
  const fortuneText = $(".fc-fortune-text");

		// getFortune = function(){
		// 	fortuneText.innerHTML = "blablablabla";
		// },

	
	getFortune();

  $(FC_BTN).on("click", ()=>{
    nextState();
    functionGetAdvice();
  })
  
	// FC_BTN.addEventListener("click",nextState);
}