
// ⏳
function Countdown(n) {
	cdc.init(n);
}

//
var cdc = (function() {
  
const template = `<div class="cdc_container">
  <ul class="cdc_flip cdc_minutePlay">
    <li class="cdc_before">
      <div class="cdc_up">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">m_before</div>
      </div>
      <div class="cdc_down">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">m_before</div>
      </div>
    </li>
    <li class="cdc_active">
      <div class="cdc_up">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">m_active</div>
      </div>
      <div class="cdc_down">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">m_active</div>
      </div>
    </li>
  </ul>
  <ul class="cdc_flip cdc_secondPlay">
    <li class="cdc_before">
      <div class="cdc_up">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">s_before</div>
      </div>
      <div class="cdc_down">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">s_before</div>
      </div>
    </li>
    <li class="cdc_active">
      <div class="cdc_up">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">s_active</div>
      </div>
      <div class="cdc_down">
        <div class="cdc_shadow"></div>
        <div class="cdc_inn">s_active</div>
      </div>
    </li>
  </ul>
</div>`;

var i_secondPlay, i_minutePlay;
var minutes, m_active, seconds, s_active;

//
function init(n) {
  try {

  minutes = m_active = seconds = s_active = 0;
  stop(true);

  var m = parseInt(n / 10),
    s = n % 10;

  m_active = m == 0 ? 0 : m - 1;
  s_active = s == 0 ? 9 : s - 1;
  
  if ($("#cdc").length==0)
    $("<div>").attr("id","cdc").appendTo("body");

  $("#cdc").html(
    template
      .replaceAll("m_before", m)
      .replaceAll("m_active", m_active)
      .replaceAll("s_before", s)
      .replaceAll("s_active", s_active)
  );

  update();

  } catch(e) { alert('cdc init error:\n' + e); }
}

//
function update() {

  i_minutePlay = setInterval(function () {
    minutePlay();
  }, 10000);
  i_secondPlay = setInterval(function () {
    secondPlay();
  }, 1000);

  function minutePlay() {
    $(".cdc_container .cdc_minutePlay li").toggleClass("cdc_active cdc_before");
    minutes = (minutes + 1) % (m_active + 1);

    $(".cdc_container .cdc_minutePlay .cdc_active .cdc_inn").text(
      m_active - minutes
    );
    stop();
  }

  function secondPlay() {
    $(".cdc_container .cdc_secondPlay li").toggleClass("cdc_active cdc_before");
    seconds = (seconds + 1) % (s_active + 1);

    $(".cdc_container .cdc_secondPlay .cdc_active .cdc_inn").text(
      s_active - seconds
    );
    stop();
  }
}

function stop(force) {
  if (!force 
    && ((m_active != minutes) 
    	|| (s_active != seconds))) return;

  clearInterval(i_minutePlay);
  clearInterval(i_secondPlay);
  
  if (!force) 
    setTimeout(()=> $("#cdc").hide('slow'), 3000);
}

return {init};
})();

