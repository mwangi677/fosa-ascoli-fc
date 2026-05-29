const supabaseUrl = "https://qpjimunbypimltwrecbg.supabase.co";

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwamltdW5ieXBpbWx0d3JlY2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3OTQ5NzYsImV4cCI6MjA5NTM3MDk3Nn0.G0iZ8IB5ptzq64lG-n-B8Rh97dg7i1zuJdLi9DW61wU";

const supabaseClient =
supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// LOGIN SYSTEM

function login(){

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;


    const savedAdmin =
    JSON.parse(localStorage.getItem("adminData"));


    const adminUsername =
    savedAdmin?.username || "admin";


    const adminPassword =
    savedAdmin?.password || "admin123";


    if(
        username === adminUsername &&
        password === adminPassword
    ){

        window.location.href = "admin.html";

    }

    else{

        alert("Wrong username or password");

    }

}

// SHOW ADMIN SECTIONS

function showSection(sectionId){

    const sections =
    document.querySelectorAll(".dashboard-section");


    sections.forEach(section => {

        section.style.display = "none";

    });


    const activeSection =
    document.getElementById(sectionId);


    if(activeSection){

        activeSection.style.display = "block";

    }

}

// DEFAULT ADMIN SECTION

if(document.getElementById("playersSection")){

    showSection("playersSection");

}

// PLAYERS STORAGE

let players =
JSON.parse(localStorage.getItem("players")) || [];

//
// ADD PLAYER

async function addPlayer(){

    const name =
    document.getElementById("playerName").value;

    const position =
    document.getElementById("playerPosition").value;

    const goals =
    document.getElementById("playerGoals").value;

    const assists =
    document.getElementById("playerAssists").value;

    const comment =
    document.getElementById("playerComment").value;

    const photoFile =
    document.getElementById("playerPhoto").files[0];


    if(name === "" || position === ""){

        alert("Please fill all fields");

        return;

    }


const fileName =
`${Date.now()}-${photoFile.name}`;

const { data: uploadData, error: uploadError } =
await supabaseClient.storage
.from("player-images")
.upload(fileName, photoFile);

if(uploadError){

    console.log(uploadError);

    alert("Image upload failed");

    return;
}

   const { data: publicUrlData } =
   supabaseClient.storage
   .from("player-images")
   .getPublicUrl(fileName);

   const photo =
   publicUrlData.publicUrl;


    const { error } = await supabaseClient
    .from("players")
    .insert([
        {
            name,
            position,
            goals,
            assists,
            comment,
            photo
        }
    ])

    if(error){
        console.log(error);

        alert(error.message);
        return;
    }


    alert("Player added successfully!");


    clearPlayerForm();

    displayPlayers();

    loadHomepagePlayers();

}



// DISPLAY PLAYERS IN ADMIN

async function displayPlayers(){

    const container =
    document.getElementById(
        "adminPlayersContainer"
    );


    if(!container) return;


    container.innerHTML = "";


    const { data, error } =
    await supabaseClient
    .from("players")
    .select("*");


    if(error){

        console.log(error);

        return;

    }


    data.forEach(player => {

        container.innerHTML += `

            <div class="player-card">

                <img
                src="${player.photo}"
                class="player-image">

                <h3>${player.name}</h3>

                <p>
                Position:
                ${player.position}
                </p>

                <p>
                Goals:
                ${player.goals}
                </p>

                <p>
                Assists:
                ${player.assists}
                </p>

                <p class="player-comment">
                ${player.comment}
                </p>

                <div class="player-actions">

                    <button
                    class="edit-btn"
                    onclick="editPlayer(${player.id})">

                        Edit

                    </button>

                    <button
                    class="delete-btn"
                    onclick="deletePlayer(${player.id})">

                        Delete

                    </button>

                </div>

            </div>

        `;

    });

}



// EDIT PLAYER

async function editPlayer(id){

    const newGoals =
    prompt("Enter new goals");


    const newAssists =
    prompt("Enter new assists");


    const { error } =
    await supabaseClient
    .from("players")
    .update({
        goals: newGoals,
        assists: newAssists
    })
    .eq("id", id);


    if(error){

        console.log(error);

        return;

    }


    alert("Player updated successfully");


    displayPlayers();

    loadHomepagePlayers();

}



// DELETE PLAYER

async function deletePlayer(id){

    const { error } =
    await supabaseClient
    .from("players")
    .delete()
    .eq("id", id);


    if(error){

        console.log(error);

        return;

    }


    alert("Player deleted successfully");


    displayPlayers();

    loadHomepagePlayers();

}



// LOAD PLAYERS ON HOMEPAGE

async function loadHomepagePlayers(){

    const homepagePlayers =
    document.getElementById(
        "homepagePlayers"
    );


    if(!homepagePlayers) return;


    homepagePlayers.innerHTML = "";


    const { data, error } =
    await supabaseClient
    .from("players")
    .select("*");


    if(error){

        console.log(error);

        return;

    }


    data.forEach(player => {

        homepagePlayers.innerHTML += `

            <div class="player-card">

                <img
                src="${player.photo}"
                class="player-image">

                <h3>${player.name}</h3>

                <p>
                Position:
                ${player.position}
                </p>

                <p>
                Goals:
                ${player.goals}
                </p>

                <p>
                Assists:
                ${player.assists}
                </p>

                <p class="player-comment">
                ${player.comment}
                </p>

            </div>

        `;

    });

}



// CLEAR PLAYER FORM

function clearPlayerForm(){

    document.getElementById("playerName").value = "";

    document.getElementById("playerPosition").value = "";

    document.getElementById("playerGoals").value = "";

    document.getElementById("playerAssists").value = "";

    document.getElementById("playerComment").value = "";

    document.getElementById("playerPhoto").value = "";

}


// MATCHES STORAGE

let matches =
JSON.parse(localStorage.getItem("matches")) || [];

// ADD MATCH

async function addMatch(){

    const homeTeam =
    document.getElementById("homeTeam").value;


    const awayTeam =
    document.getElementById("awayTeam").value;


    const matchDate =
    document.getElementById("matchDate").value;

    const matchTime =
    document.getElementById("matchTime").value;


    const homeLogoFile =
    document.getElementById("homeLogo").files[0];


    const awayLogoFile =
    document.getElementById("awayLogo").files[0];

    const homeLogo =
    URL.createObjectURL(homeLogoFile);

    const awayLogo =
    URL.createObjectURL(awayLogoFile);



    const match = {

        id: Date.now(),

        homeTeam,
        awayTeam,
        matchDate,
        matchTime,
        homeLogo,
        awayLogo

    };


    const { error } =
await supabaseClient
.from("matches")
.insert([
    {
        homeTeam,
        awayTeam,
        matchDate,
        matchTime,
        homeLogo,
        awayLogo
    }
]);


if(error){

    console.log(error);

    alert("Error adding match");

    return;

}


alert("Match added successfully!");


    displayMatches();

    loadHomepageMatches();

    clearMatchForm();

}


// DISPLAY MATCHES

async function displayMatches(){

    const container =
    document.getElementById(
        "matchesContainer"
    );


    if(!container) return;


    container.innerHTML = "";


    const { data, error } =
    await supabaseClient
    .from("matches")
    .select("*");


    if(error){

        console.log(error);

        return;

    }


    data.forEach(match => {

        container.innerHTML += `

            <div class="player-card">

                <div class="match-logos">

                    <img
                    src="${match.homeLogo}"
                    class="team-logo">

                    <h3>
                    ${match.homeTeam}
                    VS
                    ${match.awayTeam}
                    </h3>

                    <img
                    src="${match.awayLogo}"
                    class="team-logo">

                </div>

                <p>
                Date:
                ${match.matchDate}
                </p>

                <p>
                Time:
                ${match.matchTime}
                </p>

                <button
                class="delete-btn"
                onclick="deleteMatch(${match.id})">

                    Delete

                </button>

            </div>

        `;

    });

}




// DELETE MATCH

async function deleteMatch(id){

    const { error } =
    await supabaseClient
    .from("matches")
    .delete()
    .eq("id", id);


    if(error){

        console.log(error);

        alert("Error deleting match");

        return;

    }


    alert("Match deleted successfully");


    displayMatches();

    loadHomepageMatches();

}

// LOAD HOMEPAGE MATCHES

async function loadHomepageMatches(){

    const homepageMatches =
    document.getElementById(
        "homepageMatches"
    );


    if(!homepageMatches) return;


    homepageMatches.innerHTML = "";


    const { data, error } =
    await supabaseClient
    .from("matches")
    .select("*");


    if(error){

        console.log(error);

        return;

    }


    data.forEach(match => {

        homepageMatches.innerHTML += `

            <div class="player-card">

                <div class="match-logos">

                    <img
                    src="${match.homeLogo}"
                    class="team-logo">

                    <h3>
                    ${match.homeTeam}
                    VS
                    ${match.awayTeam}
                    </h3>

                    <img
                    src="${match.awayLogo}"
                    class="team-logo">

                </div>

                <p>
                Date:
                ${match.matchDate}
                </p>

                <p>
                Time:
                ${match.matchTime}
                </p>

            </div>

        `;

    });

}

// CLEAR MATCH FORM


function clearMatchForm(){

    document.getElementById("homeTeam").value = "";

    document.getElementById("awayTeam").value = "";

    document.getElementById("matchDate").value = "";

    document.getElementById("homeLogo").value = "";

    document.getElementById("awayLogo").value = "";

}

// UPDATE CLUB STATS

async function updateStats(){

    const matchesPlayed =
    document.getElementById(
        "matchesPlayed"
    ).value;


    const matchesWon =
    document.getElementById(
        "matchesWon"
    ).value;


    const goalsScored =
    document.getElementById(
        "goalsScored"
    ).value;


    const { error } =
    await supabaseClient
    .from("stats")
    .update({
    matchesPlayed: matchesPlayed,
    matchesWon: matchesWon,
    goalsScored: goalsScored
})
.eq("id", 1)

    
    if(error){

        console.log(error);

        alert("Error updating stats");

        return;

    }


    alert("Stats updated successfully");


    loadClubStats();

}


// LOAD CLUB STATS

async function loadClubStats(){

    const { data, error } =
    await supabaseClient
    .from("stats")
    .select("*")
    .single();


    if(error){

        console.log(error);

        return;

    }


    const played =
    document.getElementById(
        "homeMatchesPlayed"
    );


    const won =
    document.getElementById(
        "homeMatchesWon"
    );


    const goals =
    document.getElementById(
        "homeGoalsScored"
    );


    if(played){

        played.innerText =
        data.matchesPlayed;

    }


    if(won){

        won.innerText =
        data.matchesWon;

    }


    if(goals){

        goals.innerText =
        data.goalsScored;

    }

}


// UPDATE ADMIN LOGIN

function updateAdmin(){

    const newUsername =
    document.getElementById("newAdminUsername").value;


    const newPassword =
    document.getElementById("newAdminPassword").value;


    const adminData = {

        username: newUsername,

        password: newPassword

    };


    localStorage.setItem(
        "adminData",
        JSON.stringify(adminData)
    );


    alert("Admin updated successfully");

}


// INITIAL LOADS

displayPlayers();

displayMatches();

loadHomepagePlayers();

loadHomepageMatches();

loadClubStats();

function scrollPlayersLeft(){

    document.getElementById(
        "homepagePlayers"
    ).scrollBy({

        left: -350,

        behavior: "smooth"

    });

}


function scrollPlayersRight(){

    document.getElementById(
        "homepagePlayers"
    ).scrollBy({

        left: 350,

        behavior: "smooth"

    });

}


const slides =
document.querySelectorAll(".slide");

const nextBtn =
document.querySelector(".next");

const prevBtn =
document.querySelector(".prev");

let currentSlide = 0;


function showSlide(index){

    slides.forEach(slide => {

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

}


nextBtn.addEventListener("click", () => {

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    showSlide(currentSlide);

});


prevBtn.addEventListener("click", () => {

    currentSlide--;

    if(currentSlide < 0){

        currentSlide = slides.length - 1;

    }

    showSlide(currentSlide);

});

setInterval(() => {

    currentSlide++;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    showSlide(currentSlide);

}, 3000);


function logout(){

    window.location.href = "login.html";

}

