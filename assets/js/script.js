$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // FIX #15 — Smooth scroll was landing with headings hidden behind the
    // fixed navbar because it scrolled to the raw element top with no offset.
    // We now subtract the navbar height (65px) so the target section is fully
    // visible after scrolling.  A null-guard is also added so clicking any
    // anchor whose target does not exist on the page (e.g. external #links)
    // does not throw a TypeError and break the handler entirely.
    const NAVBAR_HEIGHT = 65;

    $('a[href*="#"]').on('click', function (e) {
        const target = $(this).attr('href');
        const $target = $(target);

        // Only intercept anchors that resolve to an element on this page
        if (!$target.length) return;

        e.preventDefault();
        $('html, body').animate({
            scrollTop: $target.offset().top - NAVBAR_HEIGHT,
        }, 500, 'linear');
    });

    // emailjs contact form
    $("#contact-form").submit(function (event) {
        emailjs.init("user_TTDmetQLYgWCLzHTDgqxm");
        emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                document.getElementById("contact-form").reset();
                alert("Form Submitted Successfully");
            }, function (error) {
                console.log('FAILED...', error);
                alert("Form Submission Failed! Try Again");
            });
        event.preventDefault();
    });

});

// tab visibility change
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | HARSH PANDEY";
        $("#favicon").attr("href", "assets/images/favicon.png");
    } else {
        document.title = "Come Back To Portfolio";
        $("#favicon").attr("href", "assets/images/favhand.png");
    }
});

// typed js effect
var typed = new Typed(".typing-text", {
    strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});

// fetch skills and projects
async function fetchData(type = "skills") {
    let response;
    type === "skills"
        ? response = await fetch("skills.json")
        : response = await fetch("./projects/projects.json");
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
            <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
            </div>
        </div>`;
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        projectHTML += `
        <div class="box tilt">
            <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
    });
    projectsContainer.innerHTML = projectHTML;

    // FIX #16 — VanillaTilt.init is called here, inside the .then() callback,
    // AFTER the project HTML has been injected into the DOM. The old code also
    // called VanillaTilt.init globally below (before the async fetch resolved),
    // meaning querySelectorAll('.tilt') returned an empty NodeList every time
    // and no tilt effect was ever applied. The duplicate global call is removed.
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });
}

fetchData().then(data => { showSkills(data); });
fetchData("projects").then(data => { showProjects(data); });

// FIX #16 — Removed the premature global VanillaTilt.init() call that was
// here. Projects are loaded asynchronously, so .tilt elements do not exist
// in the DOM at this point. The init now lives inside showProjects() above.

// disable developer tools
document.onkeydown = function (e) {
    if (e.keyCode == 123) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) return false;
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
}

// tawk.to live chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();

// ===================== CERTIFICATE FILTER =====================
function filterCerts(event, cat) {
    // update active tab
    document.querySelectorAll('.cert-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    // show/hide cert boxes
    document.querySelectorAll('.cert-box').forEach(box => {
        if (cat === 'all' || box.dataset.cat === cat) {
            box.classList.remove('hidden');
        } else {
            box.classList.add('hidden');
        }
    });
}
// ===================== CERTIFICATE FILTER END =====================

/* ===== SCROLL REVEAL ANIMATION ===== */
// FIX #17 — Changed reset from true to false.
// reset: true was making every element disappear again when the user
// scrolled back up, causing a jarring flicker on re-entry. Elements
// now animate in once and stay visible, which is the expected UX.
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: false,
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });
srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .instagram', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });

/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL PROJECTS */
srtop.reveal('.work .box', { interval: 200 });

/* SCROLL CERTIFICATES */
srtop.reveal('.certificates .cert-box', { interval: 150 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });