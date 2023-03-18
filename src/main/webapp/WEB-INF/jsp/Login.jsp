<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
    <title>Login landing page</title>
</head>
<body>
<section class="side">
    <img src="./Logo-512x512-1.png" alt="">
</section>

<section class="main">
    <div class="login-container">
        <p class="title">Volei VSC</p>
        <div class="separator"></div>
        <p class="welcome-message"></p>

        <form class="login-form">
            <div class="form-control">
                <input type="text" placeholder="Username">
                <i class="fas fa-user"></i>
            </div>
            <div class="form-control">
                <input type="password" placeholder="Password">
                <i class="fas fa-lock"></i>
            </div>

            <button class="submit">Login</button>
        </form>
    </div>
</section>

</body>
</html>