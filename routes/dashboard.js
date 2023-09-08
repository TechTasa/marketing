const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../db");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    router.get("/dashboard", (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        // Access session data here, e.g., username
        res.send(`
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');

        * {
          font-family: 'Open Sans', sans-serif;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        :root {
          --grey: #F1F0F6;
          --dark-grey: #8D8D8D;
          --light: #fff;
          --dark: #000;
          --green: #81D43A;
          --light-green: #E3FFCB;
          --blue: #1775F1;
          --light-blue: #D0E4FF;
          --dark-blue: #0C5FCD;
          --red: #FC3B56;
        }
        
        html {
          overflow-x: hidden;
        }
        
        body {
          background: var(--grey);
          overflow-x: hidden;
        }
        
        a {
          text-decoration: none;
        }
        
        li {
          list-style: none;
        }
        
        
        
        
        
        
        
        /* SIDEBAR */
        #sidebar {
          position: fixed;
          max-width: 260px;
          width: 100%;
          background: var(--light);
          top: 0;
          left: 0;
          height: 100%;
          overflow-y: auto;
          scrollbar-width: none;
          transition: all .3s ease;
          z-index: 200;
        }
        #sidebar.hide {
          max-width: 60px;
        }
        #sidebar.hide:hover {
          max-width: 260px;
        }
        #sidebar::-webkit-scrollbar {
          display: none;
        }
        #sidebar .brand {
          font-size: 24px;
          display: flex;
          align-items: center;
          height: 64px;
          font-weight: 700;
          color: var(--blue);
          position: sticky;
          top: 0;
          left: 0;
          z-index: 100;
          background: var(--light);
          transition: all .3s ease;
          padding: 0 6px;
        }
        #sidebar .icon {
          min-width: 48px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 6px;
        }
        #sidebar .icon-right {
          margin-left: auto;
          transition: all .3s ease;
        }
        #sidebar .side-menu {
          margin: 36px 0;
          padding: 0 20px;
          transition: all .3s ease;
        }
        #sidebar.hide .side-menu {
          padding: 0 6px;
        }
        #sidebar.hide:hover .side-menu {
          padding: 0 20px;
        }
        #sidebar .side-menu a {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: var(--dark);
          padding: 12px 16px 12px 0;
          transition: all .3s ease;
          border-radius: 10px;
          margin: 4px 0;
          white-space: nowrap;
        }
        #sidebar .side-menu > li > a:hover {
          background: var(--grey);
        }
        #sidebar .side-menu > li > a.active .icon-right {
          transform: rotateZ(90deg);
        }
        #sidebar .side-menu > li > a.active,
        #sidebar .side-menu > li > a.active:hover {
          background: var(--blue);
          color: var(--light);
        }
        #sidebar .divider {
          margin-top: 24px;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          color: var(--dark-grey);
          transition: all .3s ease;
          white-space: nowrap;
        }
        #sidebar.hide:hover .divider {
          text-align: left;
        }
        #sidebar.hide .divider {
          text-align: center;
        }
        #sidebar .side-dropdown {
          padding-left: 54px;
          max-height: 0;
          overflow-y: hidden;
          transition: all .15s ease;
        }
        #sidebar .side-dropdown.show {
          max-height: 1000px;
        }
        #sidebar .side-dropdown a:hover {
          color: var(--blue);
        }
        #sidebar .ads {
          width: 100%;
          padding: 20px;
        }
        #sidebar.hide .ads {
          display: none;
        }
        #sidebar.hide:hover .ads {
          display: block;
        }
        #sidebar .ads .wrapper {
          background: var(--grey);
          padding: 20px;
          border-radius: 10px;
        }
        #sidebar .btn-upgrade {
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 12px 0;
          color: var(--light);
          background: var(--blue);
          transition: all .3s ease;
          border-radius: 5px;
          font-weight: 600;
          margin-bottom: 12px;
        }
        #sidebar .btn-upgrade:hover {
          background: var(--dark-blue);
        }
        #sidebar .ads .wrapper p {
          font-size: 12px;
          color: var(--dark-grey);
          text-align: center;
        }
        #sidebar .ads .wrapper p span {
          font-weight: 700;
        }
        /* SIDEBAR */
        
        
        
        
        
        /* CONTENT */
        #content {
          position: relative;
          width: calc(100% - 260px);
          left: 260px;
          transition: all .3s ease;
        }
        #sidebar.hide + #content {
          width: calc(100% - 60px);
          left: 60px;
        }
        /* NAVBAR */
        nav {
          background: var(--light);
          height: 64px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          grid-gap: 28px;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 100;
        }
        nav .toggle-sidebar {
          font-size: 18px;
          cursor: pointer;
        }
        nav form {
          max-width: 400px;
          width: 100%;
          margin-right: auto;
        }
        nav .form-group {
          position: relative;
        }
        nav .form-group input {
          width: 100%;
          background: var(--grey);
          border-radius: 5px;
          border: none;
          outline: none;
          padding: 10px 36px 10px 16px;
          transition: all .3s ease;
        }
        nav .form-group input:focus {
          box-shadow: 0 0 0 1px var(--blue), 0 0 0 4px var(--light-blue);
        }
        nav .form-group .icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 16px;
          color: var(--dark-grey);
        }
        nav .nav-link {
          position: relative;
        }
        nav .nav-link .icon {
          font-size: 18px;
          color: var(--dark);
        }
        nav .nav-link .badge {
          position: absolute;
          top: -12px;
          right: -12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--light);
          background: var(--red);
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--light);
          font-size: 10px;
          font-weight: 700;
        }
        nav .divider {
          width: 1px;
          background: var(--grey);
          height: 12px;
          display: block;
        }
        nav .profile {
          position: relative;
        }
        nav .profile img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          cursor: pointer;
        }
        nav .profile .profile-link {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--light);
          padding: 10px 0;
          box-shadow: 4px 4px 16px rgba(0, 0, 0, .1);
          border-radius: 10px;
          width: 160px;
          opacity: 0;
          pointer-events: none;
          transition: all .3s ease;
        }
        nav .profile .profile-link.show {
          opacity: 1;
          pointer-events: visible;
          top: 100%;
        }
        nav .profile .profile-link a {
          padding: 10px 16px;
          display: flex;
          grid-gap: 10px;
          font-size: 14px;
          color: var(--dark);
          align-items: center;
          transition: all .3s ease;
        }
        nav .profile .profile-link a:hover {
          background: var(--grey);
        }
        /* NAVBAR */
        
        
        
        
        /* MAIN */
        /* CONTENT */
        
        
        
        
        
        
        @media screen and (max-width: 768px) {
          #content {
            position: relative;
            width: calc(100% - 60px);
            transition: all .3s ease;
          }
          nav .nav-link,
          nav .divider {
            display: none;
          }
        }
        </style>
       <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
        <!-- SIDEBAR -->
        <section id="sidebar">
          <a href="#" class="brand"><i class='bx bxs-smile icon'></i> AdminSite</a>
          <ul class="side-menu">
            <li><a href="#" class="active"><i class='bx bxs-dashboard icon' ></i> Dashboard</a></li>
                  <li><a href="#"><i class='bx bxs-archive icon' ></i> Website</a></li>
                  <li><a href="#"><i class='bx bxs-category-alt icon' ></i> Overview</a></li>
                  <li><a href="#"><i class='bx bxs-comment-detail icon' ></i> Management</a></li>
                  <li><a href="#"><i class='bx bxs-add-to-queue icon' ></i> Teams</a></li>
                  <li><a href="#"><i class='bx bxs-compass icon'></i> Employees</a></li>
                  <li><a href="#"><i class='bx bxs-carousel icon' ></i> User control</a></li>
                  <li><a href="#"><i class='bx bxs-bell icon' ></i> Notifications login wise</a></li>
                  <li><a href="#"><i class='bx bxs-badge-check icon' ></i> Todo List </a></li>
                  <li><a href="#"><i class='bx bxs-building icon' ></i> All companies</a></li>
                  <li><a href="#"><i class='bx bxs-wallet-alt icon' ></i> All Suppliers</a></li>
                  <li><a href="#"><i class='bx bxs-layer-plus icon' ></i> All users</a></li>
                  <li><a href="#"><i class='bx bxs-camera-home icon' ></i> Social</a></li>
                  <li><a href="#"><i class='bx bxs-log-out icon' ></i> Logout</a></li>
      
            
          </ul>
          
        </section>
        <!-- SIDEBAR -->
      
        <!-- NAVBAR -->
        <section id="content">
          <!-- NAVBAR -->
          <nav>
            <i class='bx bx-menu toggle-sidebar' ></i>
            <form action="#">
              <div class="form-group">
                <input type="text" placeholder="Search...">
                <i class='bx bx-search icon' ></i>
              </div>
            </form>
            <a href="#" class="nav-link">
              <i class='bx bxs-bell icon' ></i>
              <span class="badge">5</span>
            </a>
            <a href="#" class="nav-link">
              <i class='bx bxs-message-square-dots icon' ></i>
              <span class="badge">8</span>
            </a>
            <span class="divider"></span>
            <div class="profile">
              <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cGVvcGxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="">
              <ul class="profile-link">
                <li><a href="#"><i class='bx bxs-user-circle icon' ></i> Profile</a></li>
                <li><a href="#"><i class='bx bxs-cog' ></i> Settings</a></li>
                <li><a href="#"><i class='bx bxs-log-out-circle' ></i> Logout</a></li>
              </ul>
            </div>
          </nav>
          <!-- NAVBAR -->
      
          <!-- MAIN -->
        
          <!-- MAIN -->
        </section>
        <!-- NAVBAR -->
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>   
<script>
// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})




sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})



sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})
// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item=> {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})



window.addEventListener('click', function (e) {
	if(e.target !== imgProfile) {
		if(e.target !== dropdownProfile) {
			if(dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item=> {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if(e.target !== icon) {
			if(e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})
</script>
  
        `);
        //res.render("dashboard", { username });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
      
    });
  } finally {
  }
})();
module.exports = router