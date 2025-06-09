const audio = new Audio();
const audioError = new Audio();

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "fa-IR";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

const voiceList = {
  destination: "/static/audio/destination.mp3",
  leavingDate: "/static/audio/leavingDate.mp3",
  numberOfPassenger: "/static/audio/numberOfPassenger.mp3",
  origin: "/static/audio/origin.mp3",
  notDetected: "/static/audio/notDetected.mp3",
  Problem: "/static/audio/Problem.mp3",
};

const cities = {
  THR: "تهران",
  MHD: "مشهد",
  AWZ: "اهواز",
  SYZ: "شیراز",
  BND: "بندر عباس",
  IFN: "اصفهان",
  TBZ: "تبریز",
  KIH: "کیش",
};

const voiceButtonDOM = document.getElementById("getUserVoiceData");
const inputTextDOM = document.querySelectorAll(".booking input[type='text']");
const listContentDOM = document.getElementsByClassName("list-content")[0];

voiceButtonDOM.onclick = startGettingVoice;

recognition.onresult = function (event) {
  const result = event.results[0][0].transcript;
  getTheVoiceResult(result);
};

recognition.onspeechend = function () {
  recognition.stop();
};

recognition.onnomatch = function (event) {
  playVoiceState("notDetected", audioError);
};

recognition.onerror = function (event) {
  playVoiceState("Problem", audioError);
};

audio.onended = function () {
  if (activeInput.id == "leavingDate") {
    dateObject.show();
  } else {
    recognition.start();
  }
};

// ######## END HANDLER

function playVoiceState(state, audioObj) {
  audioObj.src = voiceList[state];
  audioObj.onloadeddata = function () {
    audioObj.play();
  };
}

function* generatorInputList() {
  for (var i = 0; i < inputTextDOM.length; i++) {
    yield inputTextDOM[i];
  }
}

function tabTheElement(currentElement) {
  elementFocus(currentElement);
  const voice = currentElement.dataset.voice;
  playVoiceState(voice, audio);
}

function startGettingVoice() {
  window.inputGenerator = generatorInputList();
  const currentElement = inputGenerator.next().value;
  tabTheElement(currentElement);
}

function elementFocus(customElement) {
  inputTextDOM.forEach(function (element) {
    if (customElement == element) {
      customElement.classList.add("activeBorder");
      window.activeInput = customElement;
    } else if (element.classList.contains("activeBorder")) element.classList.remove("activeBorder");
  });
}

function fixNumbers(str) {
  var persianNumbers = [
    /۰/g,
    /۱/g,
    /۲/g,
    /۳/g,
    /۴/g,
    /۵/g,
    /۶/g,
    /۷/g,
    /۸/g,
    /۹/g,
  ];
  if (typeof str === "string") {
    for (var i = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i);
    }
  }
  return str;
}

function funcReverseString(str) {
  return str.split("").reverse().join("");
}

function seperateNumbers(numberValue) {
  if (isNaN(Number(numberValue))) {
    alert("لطفا از وارد کردن حروف خودداری فرمایید !");
    return false;
  }

  let seperatedNumber = numberValue.toString();
  seperatedNumber = funcReverseString(seperatedNumber);
  seperatedNumber = seperatedNumber.split("");

  let tmpSeperatedNumber = "";

  j = 0;
  for (let i = 0; i < seperatedNumber.length; i++) {
    tmpSeperatedNumber += seperatedNumber[i];
    j++;
    if (j == 3) {
      tmpSeperatedNumber += ",";
      j = 0;
    }
  }

  seperatedNumber = funcReverseString(tmpSeperatedNumber);
  if (seperatedNumber[0] === ",")
    seperatedNumber = seperatedNumber.replace(",", "");
  return seperatedNumber;
}

function seperateDateAndTime(date, type = "time") {
  const dateList = date.split("T");
  const finallValue = type == "date" ? dateList[0] : dateList[1];
  return finallValue;
}

function getTheVoiceResult(result) {
  result = fixNumbers(result);
  if (activeInput.id != "leavingDate") activeInput.value = result;
  if (activeInput.classList.contains("geobase")) {
    const indexCities = Object.keys(cities);
    indexCities.forEach(function (element) {
      const currentCity = cities[element];
      if (currentCity == activeInput.value)
        activeInput.value = `${activeInput.value}-${element}`;
    });
  }

  const nextInput = inputGenerator.next().value;
  if (nextInput != undefined) tabTheElement(nextInput);
  else {
    const data = {
      child: 0,
      infant: 0,
    };

    inputTextDOM.forEach(function (element) {
      let finallValue = element.value;
      if (element.classList.contains("geobase")) {
        finallValue = element.value.split("-")[1];
      } else if (element.id == "leavingDate") {
        finallValue = selectedDate;
      }
      if (!isNaN(Number(finallValue))) finallValue = Number(finallValue);

      const key = element.dataset.jsonKey;
      data[key] = finallValue;
    });

    getOnlineFlight(data);
  }
}

function emptyTheListContent() {
  listContentDOM.innerHTML = "";
}

function listDataToHtml(data) {
  data["priceAdult"] = seperateNumbers(data["priceAdult"]);
  data["status"] = data["status"] == 0 ? "نا موجود" : data["status"] + " صندلی";
  data["leaveDateTime"] = seperateDateAndTime(data["leaveDateTime"]);
  data["arrivalDateTime"] = seperateDateAndTime(data["arrivalDateTime"]);

  const htmlContent = `<div class="u-full-width content-booking"><img src="${data.airlineLogo}" id="logo"> <h6 id="ariline">${data.airlineName}</h6> <h2 id="title"><span id="from">${data.originName}</span> به <span id="to">${data.destinationName}</span></h2> <h3 id="time"><span id="leave">پرواز : ${data.leaveDateTime}</span>  <span id="arrive">حضور : ${data.arrivalDateTime}</span></h3> <h4 id="price">${data.priceAdult} ریال</h4><h5 id="entity">${data.status}</h5><div></div></div>`;

  listContentDOM.innerHTML += htmlContent;
}

function getOnlineFlight(data) {
  voiceButtonDOM.setAttribute("disabled", "disabled");
  const xhr = new XMLHttpRequest();

  const params = JSON.stringify(data);
  console.log(params);

  xhr.open("POST", "https://ws.alibaba.ir/api/v1/flights/domestic/available");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function (xhrLoaded) {
    let data = xhrLoaded.currentTarget.response;
    data = JSON.parse(data);

    if (!data.success) {
      playVoiceState("notDetected", audioError);
      voiceButtonDOM.removeAttribute("disabled");
      return false;
    }

    const RequestID = data.result.requestId;

    xhr.open(
      "GET",
      "https://ws.alibaba.ir/api/v1/flights/domestic/available/" + RequestID
    );
    xhr.setRequestHeader("Content-Type", null);

    xhr.onload = function (xhr) {
      let data = xhr.currentTarget.response;
      data = JSON.parse(data);
      let customData = [];
      emptyTheListContent();
      data.result.departing.forEach(function (val) {
        const tempObj = {
          originName: val.originName,
          destinationName: val.destinationName,
          airlineName: val.airlineName,
          leaveDateTime: val.leaveDateTime,
          arrivalDateTime: val.arrivalDateTime,
          priceAdult: val.priceAdult,
          status: val.status,
          airlineLogo: val.airlineLogo,
        };
        customData.push(tempObj);
        listDataToHtml(tempObj);
      });

      voiceButtonDOM.removeAttribute("disabled");
    };

    xhr.onerror = function () {
      console.warn("ERROR 2");
      voiceButtonDOM.removeAttribute("disabled");
    };

    xhr.send();
  };
  xhr.onerror = function () {
    console.warn("ERROR");
    voiceButtonDOM.removeAttribute("disabled");
  };

  xhr.send(params);
}
