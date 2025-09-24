@echo off
echo Starting SimpleEcom Services...

echo.
echo Starting User Service (Port 8081)...
start "User Service" cmd /k "cd user-service && mvn spring-boot:run"

timeout /t 10

echo.
echo Starting Product Service (Port 8082)...
start "Product Service" cmd /k "cd product-service && mvn spring-boot:run"

timeout /t 10

echo.
echo Starting Cart Service (Port 8083)...
start "Cart Service" cmd /k "cd cart-service && mvn spring-boot:run"

echo.
echo All services are starting...
echo User Service: http://localhost:8081
echo Product Service: http://localhost:8082
echo Cart Service: http://localhost:8083
echo.
echo Frontend: http://localhost:4200
pause