@echo off
set "SRC=C:\Users\新谷壮太郎\.gemini\antigravity\brain\d20a6c20-97c2-43c2-8f83-a5e191d0f927"
set "DEST=assets\images"

echo Saving images to "%DEST%"...

copy "%SRC%\media_1773362784722.jpg" "%DEST%\hero_city_sunset.jpg" /Y
copy "%SRC%\media_1773363185193.jpg" "%DEST%\service_events_hall.jpg" /Y
copy "%SRC%\media_1773363733607.jpg" "%DEST%\service_sns_app.jpg" /Y
copy "%SRC%\media_1773364201201.jpg" "%DEST%\service_internship_team.jpg" /Y

echo Done. Please refresh your browser.
pause