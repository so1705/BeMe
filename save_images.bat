@echo off
set "SRC_DIR=C:\Users\新谷壮太郎\.gemini\antigravity\brain\d20a6c20-97c2-43c2-8f83-a5e191d0f927"
set "DEST_DIR=assets\images"

if not exist "%DEST_DIR%" (
    mkdir "%DEST_DIR%"
)

echo Checking source files in %SRC_DIR%...

set "FILE1=media__1773362784722.jpg"
set "FILE2=media__1773363185193.jpg"
set "FILE3=media__1773363733607.jpg"
set "FILE4=media__1773364201201.jpg"

copy "%SRC_DIR%\%FILE1%" "%DEST_DIR%\hero_city_sunset.jpg" /Y
copy "%SRC_DIR%\%FILE2%" "%DEST_DIR%\service_events_hall.jpg" /Y
copy "%SRC_DIR%\%FILE3%" "%DEST_DIR%\service_sns_app.jpg" /Y
copy "%SRC_DIR%\%FILE4%" "%DEST_DIR%\service_internship_team.jpg" /Y

echo.
echo If you see "1 file(s) copied" above, it's successful.
echo If "The system cannot find the file specified" appears, please check your network or artifact folder.
pause