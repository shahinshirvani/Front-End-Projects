const getUserName = localStorage.getItem("userName");
const displayUserNameTitle = document.getElementById("getUserName");
const displayUserNameTicket = document.getElementById("getUserNameTicket");
const getEmail = localStorage.getItem("email");
const displayEmail = document.getElementById("getEmail");
const getImg = localStorage.getItem("image")
const getGitUserName = localStorage.getItem("gitUserName")
const displayGitUserName = document.getElementById("getGithubUserName")

const displayImg = document.getElementById("getImg")

const today = new Date()
const options = { year: 'numeric', month: 'short', day: 'numeric' };
const formattedDate = today.toLocaleDateString('en-US', options);

document.getElementById('data').textContent = formattedDate
displayUserNameTitle.innerHTML = `Congrats, <span class="username-highlight">${getUserName}</span>!<br>Your ticket is ready.`;
displayEmail.innerHTML = `We've emailed your ticket to <br><span class='email-highlight'>${getEmail}</span> and will send updates in<br>the run up to the event`
displayImg.src = getImg
displayGitUserName.innerHTML = getGitUserName
displayUserNameTicket.innerHTML = getUserName

