#!/bin/bash
SRC_DIR="/mnt/c/Users/新谷壮太郎/.gemini/antigravity/brain/d20a6c20-97c2-43c2-8f83-a5e191d0f927"
DEST_DIR="assets/images"

mkdir -p "$DEST_DIR"

echo "Checking source files in $SRC_DIR..."

FILE1="media__1773362784722.jpg"
FILE2="media__1773363185193.jpg"
FILE3="media__1773363733607.jpg"
FILE4="media__1773364201201.jpg"

cp "$SRC_DIR/$FILE1" "$DEST_DIR/hero_city_sunset.jpg"
cp "$SRC_DIR/$FILE2" "$DEST_DIR/service_events_hall.jpg"
cp "$SRC_DIR/$FILE3" "$DEST_DIR/service_sns_app.jpg"
cp "$SRC_DIR/$FILE4" "$DEST_DIR/service_internship_team.jpg"

echo "Copy complete. Files in $DEST_DIR:"
ls -lh "$DEST_DIR"
