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

            <article class="player-card">

                <div class="player-image-wrap">
                    <img
                    src="${player.photo}"
                    alt="${player.name}"
                    class="player-image">
                </div>

                <div class="player-card-body">
                    <h3>${player.name}</h3>
                    <span class="player-position">${player.position}</span>

                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-value">${player.goals ?? 0}</span>
                            <span class="stat-label">Goals</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${player.assists ?? 0}</span>
                            <span class="stat-label">Assists</span>
                        </div>
                    </div>

                    <p class="player-comment">${player.comment || ""}</p>
                </div>

            </article>

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


// NEWS

async function addNews(){

    const title =
    document.getElementById("newsTitle").value.trim();

    const newsDate =
    document.getElementById("newsDate").value;

    const excerpt =
    document.getElementById("newsExcerpt").value.trim();

    const content =
    document.getElementById("newsContent").value.trim();

    const photoFile =
    document.getElementById("newsPhoto").files[0];


    if(title === "" || excerpt === "" || newsDate === ""){

        alert("Please enter a title, date, and summary");

        return;

    }


    let photo = null;


    if(photoFile){

        const fileName =
        `news-${Date.now()}-${photoFile.name}`;

        const { error: uploadError } =
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

        photo = publicUrlData.publicUrl;

    }


    const { error } =
    await supabaseClient
    .from("news")
    .insert([
        {
            title,
            excerpt,
            content,
            news_date: newsDate,
            photo
        }
    ]);


    if(error){

    console.log(error);

    alert(error.message);

    return;

}


    alert("News published successfully!");

    clearNewsForm();

    displayNews();

    loadHomepageNews();

}


async function displayNews(){

    const container =
    document.getElementById("adminNewsContainer");


    if(!container) return;


    container.innerHTML = "";


    const { data, error } =
    await supabaseClient
    .from("news")
    .select("*")
    .order("news_date", { ascending: false });


    if(error){

        console.log(error);

        return;

    }


    if(!data.length){

        container.innerHTML =
        "<p class=\"news-empty\">No news articles yet.</p>";

        return;

    }


    data.forEach(item => {

        const imageBlock = item.photo
        ? `<img src="${item.photo}" alt="" class="news-card-image">`
        : `<div class="news-card-image news-card-image--placeholder">Club News</div>`;

        container.innerHTML += `

            <article class="news-card">

                ${imageBlock}

                <div class="news-card-body">
                    <time class="news-card-date">${formatNewsDate(item.news_date)}</time>
                    <h3 class="news-card-title">${item.title}</h3>
                    <p class="news-card-excerpt">${item.excerpt}</p>
                    ${item.content ? `<p class="news-card-content">${item.content}</p>` : ""}

                    <button
                    type="button"
                    class="delete-btn news-delete-btn"
                    onclick="deleteNews(${item.id})">
                        Delete Article
                    </button>
                </div>

            </article>

        `;

    });

}


async function deleteNews(id){

    if(!confirm("Delete this news article?")){

        return;

    }

    const { error } =
    await supabaseClient
    .from("news")
    .delete()
    .eq("id", id);


    if(error){

        console.log(error);

        alert("Error deleting news");

        return;

    }


    alert("News deleted successfully");

    displayNews();

    loadHomepageNews();

}


async function loadHomepageNews(){

    const container =
    document.getElementById("homepageNews");


    if(!container) return;

    const newsSection =
    document.querySelector(".news-section");

    container.innerHTML = "";
    container.classList.remove("news-grid--filled");

    if(newsSection){

        newsSection.classList.remove("news-section--filled");

    }


    const { data, error } =
    await supabaseClient
    .from("news")
    .select("*")
    .order("news_date", { ascending: false });


    if(error){

        console.log(error);

        container.innerHTML =
        "<p class=\"news-empty\">News will appear here once the club publishes updates.</p>";

        return;

    }


    if(!data.length){

        container.innerHTML =
        "<p class=\"news-empty\">No news yet. Check back soon for club updates.</p>";

        return;

    }

    container.classList.add("news-grid--filled");

    if(newsSection){

        newsSection.classList.add("news-section--filled");

    }


    data.forEach(item => {

        const imageBlock = item.photo
        ? `<img src="${item.photo}" alt="${item.title}" class="news-card-image">`
        : `<div class="news-card-image news-card-image--placeholder">Club News</div>`;

        container.innerHTML += `

            <article class="news-card">

                ${imageBlock}

                <div class="news-card-body">
                    <time class="news-card-date">${formatNewsDate(item.news_date)}</time>
                    <h3 class="news-card-title">${item.title}</h3>
                    <p class="news-card-excerpt">${item.excerpt}</p>
                    ${item.content ? `<p class="news-card-content">${item.content}</p>` : ""}
                </div>

            </article>

        `;

    });

}


function formatNewsDate(dateValue){

    if(!dateValue) return "";

    const date = new Date(dateValue + "T12:00:00");

    if(Number.isNaN(date.getTime())){

        return dateValue;

    }

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}


function clearNewsForm(){

    const title = document.getElementById("newsTitle");

    const newsDate = document.getElementById("newsDate");

    const excerpt = document.getElementById("newsExcerpt");

    const content = document.getElementById("newsContent");

    const photo = document.getElementById("newsPhoto");


    if(title) title.value = "";

    if(newsDate) newsDate.value = "";

    if(excerpt) excerpt.value = "";

    if(content) content.value = "";

    if(photo) photo.value = "";

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

            <article class="match-card">

                <div class="match-card-header">
                    <span class="match-card-badge">Upcoming</span>
                    <span class="match-card-venue">League fixture</span>
                </div>

                <div class="match-card-body">
                    <div class="match-teams">
                        <div class="match-team">
                            <img
                            src="${match.homeLogo}"
                            alt="${match.homeTeam}"
                            class="team-logo">
                            <span class="match-team-name">${match.homeTeam}</span>
                        </div>

                        <span class="match-vs">VS</span>

                        <div class="match-team match-team--away">
                            <img
                            src="${match.awayLogo}"
                            alt="${match.awayTeam}"
                            class="team-logo">
                            <span class="match-team-name">${match.awayTeam}</span>
                        </div>
                    </div>

                    <div class="match-meta">
                        <span class="match-meta-item">
                            <strong>Date</strong> ${match.matchDate}
                        </span>
                        <span class="match-meta-item">
                            <strong>Time</strong> ${match.matchTime}
                        </span>
                    </div>
                </div>

            </article>

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

displayNews();

loadHomepagePlayers();

loadHomepageMatches();

loadHomepageNews();

loadClubStats();

function scrollPlayersLeft(){

    document.getElementById(
        "homepagePlayers"
    ).scrollBy({

        left: -320,

        behavior: "smooth"

    });

}


function scrollPlayersRight(){

    document.getElementById(
        "homepagePlayers"
    ).scrollBy({

        left: 320,

        behavior: "smooth"

    });

}


const slides =
document.querySelectorAll(".slide");

const nextBtn =
document.querySelector(".next");

const prevBtn =
document.querySelector(".prev");

const heroDotsContainer =
document.getElementById("heroDots");

let currentSlide = 0;
let heroIntervalId = null;


function showSlide(index){

    if(!slides.length) return;

    slides.forEach(slide => {

        slide.classList.remove("active");

    });

    slides[index].classList.add("active");

    if(heroDotsContainer){

        const dots =
        heroDotsContainer.querySelectorAll(".hero-dot");

        dots.forEach((dot, i) => {

            dot.classList.toggle("active", i === index);

        });

    }

}


function goToSlide(index){

    if(!slides.length) return;

    currentSlide = index;

    if(currentSlide >= slides.length){

        currentSlide = 0;

    }

    if(currentSlide < 0){

        currentSlide = slides.length - 1;

    }

    showSlide(currentSlide);

}


function startHeroAutoplay(){

    if(heroIntervalId || !slides.length) return;

    heroIntervalId = setInterval(() => {

        goToSlide(currentSlide + 1);

    }, 5000);

}


if(slides.length){

    if(heroDotsContainer){

        slides.forEach((_, i) => {

            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "hero-dot" + (i === 0 ? " active" : "");
            dot.setAttribute("aria-label", "Go to slide " + (i + 1));

            dot.addEventListener("click", () => {

                goToSlide(i);

            });

            heroDotsContainer.appendChild(dot);

        });

    }

    if(nextBtn){

        nextBtn.addEventListener("click", () => {

            goToSlide(currentSlide + 1);

        });

    }

    if(prevBtn){

        prevBtn.addEventListener("click", () => {

            goToSlide(currentSlide - 1);

        });

    }

    startHeroAutoplay();

}


const siteHeader =
document.getElementById("siteHeader");

if(siteHeader){

    window.addEventListener("scroll", () => {

        siteHeader.classList.toggle(
            "is-scrolled",
            window.scrollY > 40
        );

    });

}


const navToggle =
document.getElementById("navToggle");

const navLinks =
document.getElementById("navLinks");

if(navToggle && navLinks){

    navToggle.addEventListener("click", () => {

        const isOpen =
        navToggle.classList.toggle("is-open");

        navLinks.classList.toggle("is-open", isOpen);

        navToggle.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navToggle.classList.remove("is-open");

            navLinks.classList.remove("is-open");

            navToggle.setAttribute("aria-expanded", "false");

        });

    });

}


const footerYear =
document.getElementById("footerYear");

if(footerYear){

    footerYear.textContent = new Date().getFullYear();

}


function logout(){

    window.location.href = "login.html";

}

