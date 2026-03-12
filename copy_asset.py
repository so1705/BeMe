import shutil
import os

src = r"C:\Users\新谷壮太郎\.gemini\antigravity\brain\d20a6c20-97c2-43c2-8f83-a5e191d0f927\premium_sns_network_foundation_1773340793019.png"
dst_dir = r"c:\Users\新谷壮太郎\.gemini\antigravity\playground\prime-planetoid\assets\images"
dst = os.path.join(dst_dir, "premium_sns_network_foundation_1773340793019.png")

if not os.path.exists(dst_dir):
    os.makedirs(dst_dir)

try:
    shutil.copy2(src, dst)
    print(f"Successfully copied {src} to {dst}")
except Exception as e:
    print(f"Error: {e}")
