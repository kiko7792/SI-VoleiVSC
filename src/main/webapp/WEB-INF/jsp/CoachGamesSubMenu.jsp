<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Jogos</title>
    <link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/CoachGamesSubMenu.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="https://kit.fontawesome.com/6132df651f.js" crossorigin="anonymous"></script>

</head>

<body>
<div class="nav-container">
    <nav>
        <div class="nav-header"></div>
        <a href="http://localhost:8080/coach" class="logo">
            <img src="/static/images/Logo-512x512-1.png" alt="Vitória SC Logo">
            <span class="nav-item">Voleibol VSC</span>
        </a>
        <ul class="nav-links">
            <div class="navOPT">
                <li><a href="http://localhost:8080/coach">
                    <i class="fas fa-home"></i>
                    <span class="nav-item">Menu</span>
                </a></li>
            </div>
            <div class="navOPT">
                <li><a href="http://localhost:8080/profile">
                    <i class="fas fa-user"></i>
                    <span class="nav-item">Perfil</span>
                </a></li>
            </div>
            <div class="navOPT">
                <li><a href="http://localhost:8080/userSettingsCoach">
                    <i class="fas fa-cog"></i>
                    <span class="nav-item">Definições</span>
                </a></li>
            </div>
            <li><a href="http://localhost:8080/login" class="logout">
                <i class="fas fa-sign-out-alt"></i>
                <span class="nav-item">Sair</span>
            </a></li>
        </ul>
    </nav>
    <script>
        var toggleMenu = document.getElementById('nav-links');
        var nav = document.querySelector('nav');

        toggleMenu.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    </script>
</div>

<div class="container">

    <div class="header">
        <h1>Jogos</h1>
    </div>

    <div class="options">

        <div class="option"><a href="http://localhost:8080/listGames">
            <div class="nameCat">
                <i class="icon fa-solid fa-magnifying-glass text-center mr-1"></i>
                <span class="catName">Visualizar Momentos do Jogo</span>
            </div></a>
        </div>

        <div class="option"><a href="http://localhost:8080/infoGameVideo">
            <div class="nameCat">
                <i class=" icon fa-solid fa-volleyball"></i>
                <span class="catName">Criar Jogo</span>
            </div></a>
        </div>
    </div>
</div>
</body>
</html>