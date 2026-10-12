@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Restaurant Bill Generator Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "LOCAL_MVN=C:\Users\vatti\.m2\wrapper\dists\apache-maven-3.8.6-bin\1ks0nkde5v1pk9vtc31i9d0lcd\apache-maven-3.8.6\bin\mvn.cmd"

if exist "%LOCAL_MVN%" (
    "%LOCAL_MVN%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found! Please ensure Maven is installed or in PATH.
exit /b 1
