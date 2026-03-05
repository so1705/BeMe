@echo off
echo =======================================================
echo Preparing image assets for GitHub and Vercel Deployment
echo =======================================================

if not exist "assets\images" mkdir "assets\images"

copy "..\..\brain\6a0d001b-462a-4e2b-a26a-025215c7a48e\*.png" "assets\images\"
copy "..\..\brain\6a0d001b-462a-4e2b-a26a-025215c7a48e\*.jpg" "assets\images\"

echo.
echo Done! Images have been beautifully copied to assets\images\
echo You can now safely push this project to GitHub.
pause
